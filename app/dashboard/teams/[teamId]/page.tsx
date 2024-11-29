import { notFound, redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { auth } from '@/lib/auth';
import { TeamDetails } from '@/components/TeamDetails';

interface TeamPageProps {
  params: {
    teamId: string;
  };
}

async function getTeam(teamId: string) {
  const user = await auth();
  if (!user) return null;

  const team = await db.team.findUnique({
    where: { id: teamId },
    include: {
      members: {
        include: {
          user: true,
        },
      },
      projects: {
        include: {
          tasks: {
            include: {
              assignee: true,
            },
          },
        },
      },
    },
  });

  if (!team) return null;

  // Transform the data to match the expected interface
  return {
    ...team,
    members: team.members.map(member => ({
      user: {
        id: member.user.id,
        name: member.user.name,
        email: member.user.email,
      },
      role: member.role,
    })),
    projects: team.projects.map(project => ({
      ...project,
      tasks: project.tasks.map(task => ({
        id: task.id,
        title: task.title,
        status: task.status,
        assignedTo: task.assignee ? {
          id: task.assignee.id,
          name: task.assignee.name,
          email: task.assignee.email,
        } : null,
      })),
    })),
  };
}

export default async function TeamPage({ params }: TeamPageProps) {
  const user = await auth();
  if (!user) {
    redirect('/auth/signin');
  }

  const team = await getTeam(params.teamId);
  if (!team) {
    notFound();
  }

  return (
    <div className="p-6">
      <TeamDetails team={team} currentUserId={user.id} />
    </div>
  );
}
