import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const user = await auth();
    if (!user?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Get user's organization ID
    const userOrg = await db.user.findUnique({
      where: { email: user.email },
      select: { organization: true },
    });

    if (!userOrg?.organization) {
      return new NextResponse('Organization not found', { status: 404 });
    }

    // Fetch all projects with their tasks
    const projects = await db.project.findMany({
      where: {
        orgId: userOrg.organization.id,
      },
      include: {
        tasks: {
          select: {
            id: true,
            title: true,
            status: true,
            priority: true,
            createdAt: true,
            dueDate: true,
            project: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    // Fetch all tasks
    const tasks = await db.task.findMany({
      where: {
        project: {
          orgId: userOrg.organization.id,
        },
      },
      select: {
        id: true,
        title: true,
        status: true,
        priority: true,
        createdAt: true,
        dueDate: true,
        project: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json({
      projects,
      tasks,
    });
  } catch (error) {
    console.error('Analytics API Error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
