import { Suspense } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { TeamsList } from '@/components/TeamsList';

async function getTeams() {
  const user = await auth();
  if (!user) return [];

  const teams = await prisma.team.findMany({
    where: {
      organization: {
        users: {
          some: {
            id: user.id
          }
        }
      }
    },
    include: {
      members: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            }
          }
        }
      },
      projects: {
        select: {
          id: true,
          name: true,
          tasks: {
            select: {
              id: true,
              status: true,
            }
          }
        }
      }
    }
  });

  return teams;
}

export default async function TeamsPage() {
  const teams = await getTeams();

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Teams</h1>
        <Link
          href="/dashboard/teams/new"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          New Team
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Suspense fallback={<div>Loading teams...</div>}>
          <TeamsList teams={teams} />
        </Suspense>
      </div>
    </div>
  );
}
