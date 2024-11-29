import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { TaskStatus, TaskPriority } from '@prisma/client';
import { startOfWeek, endOfWeek, isBefore } from 'date-fns';
import { getSession } from '@/lib/session';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    // Get the session
    const session = await getSession();

    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const userId = session.user.id;

    const now = new Date();
    const weekStart = startOfWeek(now);
    const weekEnd = endOfWeek(now);

    // Fetch all tasks
    const tasks = await db.task.findMany({
      where: {
        OR: [
          { assigneeId: userId },
          {
            project: {
              users: {
                some: {
                  id: userId
                }
              }
            }
          }
        ]
      },
      include: {
        project: true,
        assignee: true,
      }
    });

    // Calculate task statistics
    const tasksByStatus = tasks.reduce((acc, task) => {
      acc[task.status] = (acc[task.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const tasksByPriority = tasks.reduce((acc, task) => {
      acc[task.priority] = (acc[task.priority] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const overdueTasks = tasks.filter(
      task => task.dueDate && isBefore(new Date(task.dueDate), now) && task.status !== TaskStatus.COMPLETED
    ).length;

    const dueThisWeek = tasks.filter(
      task => task.dueDate && 
      new Date(task.dueDate) >= weekStart && 
      new Date(task.dueDate) <= weekEnd
    ).length;

    // Fetch recent projects
    const projects = await db.project.findMany({
      where: {
        users: {
          some: {
            id: userId
          }
        }
      },
      include: {
        tasks: true,
      },
      take: 5,
      orderBy: {
        updatedAt: 'desc'
      }
    });

    // Calculate project progress
    const recentProjects = projects.map(project => {
      const totalTasks = project.tasks.length;
      const completedTasks = project.tasks.filter(task => task.status === TaskStatus.COMPLETED).length;
      const progress = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

      return {
        id: project.id,
        name: project.name,
        status: project.status,
        progress,
      };
    });

    // Fetch team activities
    const activities = await db.timeEntry.findMany({
      where: {
        project: {
          users: {
            some: {
              id: userId
            }
          }
        }
      },
      include: {
        user: true,
      },
      take: 5,
      orderBy: {
        createdAt: 'desc'
      }
    });

    const recentActivities = activities.map(activity => ({
      id: activity.id,
      user: activity.user.name || activity.user.email || 'Unknown User',
      action: activity.description,
      target: activity.duration,
      timestamp: activity.createdAt.toISOString(),
    }));

    // Calculate task distribution
    const teamMembers = await db.user.findMany({
      where: {
        teamMemberships: {
          some: {
            team: {
              projects: {
                some: {
                  users: {
                    some: {
                      id: userId
                    }
                  }
                }
              }
            }
          }
        }
      },
      include: {
        tasks: true,
      }
    });

    const taskDistribution = teamMembers.map(member => ({
      user: member.name || member.email || 'Unknown User',
      tasks: member.tasks.length,
    }));

    return NextResponse.json({
      tasks: {
        total: tasks.length,
        byStatus: tasksByStatus,
        byPriority: tasksByPriority,
        overdue: overdueTasks,
        dueThisWeek,
      },
      projects: {
        total: projects.length,
        active: projects.filter(p => p.status === 'ACTIVE').length,
        completed: projects.filter(p => p.status === 'COMPLETED').length,
        recent: recentProjects,
      },
      team: {
        totalMembers: teamMembers.length,
        recentActivities,
        taskDistribution,
      }
    });
  } catch (error) {
    console.error('Dashboard API Error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
