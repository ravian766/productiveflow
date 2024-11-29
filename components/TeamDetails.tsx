'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  UserIcon,
  FolderIcon,
  ClipboardDocumentListIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';
import { TeamMemberManager } from './TeamMemberManager';
import { TeamProjects } from './TeamProjects';

interface User {
  id: string;
  name: string | null;
  email: string;
}

interface TeamMember {
  user: User;
  role: string;
}

interface Task {
  id: string;
  title: string;
  status: string;
  assignedTo: User | null;
}

interface Project {
  id: string;
  name: string;
  tasks: Task[];
}

interface Team {
  id: string;
  name: string;
  description: string | null;
  members: TeamMember[];
  projects: Project[];
}

interface TeamDetailsProps {
  team: Team;
  currentUserId: string;
}

export function TeamDetails({ team, currentUserId }: TeamDetailsProps) {
  const [activeTab, setActiveTab] = useState<'members' | 'projects'>('members');

  const totalTasks = team.projects.reduce(
    (acc, project) => acc + project.tasks.length,
    0
  );

  return (
    <div>
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-5 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">{team.name}</h2>
            <Link
              href={`/dashboard/teams/${team.id}/edit`}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Edit Team
            </Link>
          </div>
          {team.description && (
            <p className="mt-2 text-sm text-gray-600">{team.description}</p>
          )}
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-3">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <UserIcon className="h-6 w-6 text-gray-400" aria-hidden="true" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Team Members
                      </dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900">
                          {team.members.length}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <FolderIcon className="h-6 w-6 text-gray-400" aria-hidden="true" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Projects
                      </dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900">
                          {team.projects.length}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <ClipboardDocumentListIcon
                      className="h-6 w-6 text-gray-400"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Total Tasks
                      </dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900">
                          {totalTasks}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="px-6 py-3 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('members')}
              className={`${
                activeTab === 'members'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              } whitespace-nowrap pb-3 px-1 border-b-2 font-medium text-sm`}
            >
              Members
            </button>
            <button
              onClick={() => setActiveTab('projects')}
              className={`${
                activeTab === 'projects'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              } whitespace-nowrap pb-3 px-1 border-b-2 font-medium text-sm`}
            >
              Projects
            </button>
          </nav>
        </div>
        <div className="p-6">
          {activeTab === 'members' ? (
            <TeamMemberManager
              teamId={team.id}
              members={team.members}
              currentUserId={currentUserId}
            />
          ) : (
            <TeamProjects projects={team.projects} teamId={team.id} />
          )}
        </div>
      </div>
    </div>
  );
}
