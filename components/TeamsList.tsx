'use client';

import { UsersIcon, FolderIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

interface User {
  id: string;
  name: string | null;
  email: string;
}

interface TeamMember {
  user: User;
  role: string;
}

interface Project {
  id: string;
  name: string;
  tasks: {
    id: string;
    status: string;
  }[];
}

interface Team {
  id: string;
  name: string;
  description: string | null;
  members: TeamMember[];
  projects: Project[];
}

interface TeamsListProps {
  teams: Team[];
}

export function TeamsList({ teams }: TeamsListProps) {
  if (!teams.length) {
    return (
      <div className="col-span-full text-center py-12 bg-white rounded-lg border border-gray-200">
        <UsersIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-semibold text-gray-900">No teams</h3>
        <p className="mt-1 text-sm text-gray-500">Get started by creating a new team.</p>
        <div className="mt-6">
          <Link
            href="/dashboard/teams/new"
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Create Team
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      {teams.map((team) => (
        <Link
          key={team.id}
          href={`/dashboard/teams/${team.id}`}
          className="block p-6 bg-white rounded-lg border border-gray-200 hover:border-blue-500 transition-colors duration-200"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">{team.name}</h3>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {team.members.length} members
            </span>
          </div>
          
          {team.description && (
            <p className="text-sm text-gray-600 mb-4">{team.description}</p>
          )}

          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center">
              <FolderIcon className="h-4 w-4 mr-1" />
              <span>{team.projects.length} projects</span>
            </div>
            <div className="flex -space-x-2">
              {team.members.slice(0, 3).map((member) => (
                <div
                  key={member.user.id}
                  className="h-8 w-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center"
                  title={member.user.name || member.user.email}
                >
                  <span className="text-xs font-medium text-gray-600">
                    {(member.user.name || member.user.email).charAt(0).toUpperCase()}
                  </span>
                </div>
              ))}
              {team.members.length > 3 && (
                <div className="h-8 w-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center">
                  <span className="text-xs font-medium text-gray-600">
                    +{team.members.length - 3}
                  </span>
                </div>
              )}
            </div>
          </div>
        </Link>
      ))}
    </>
  );
}
