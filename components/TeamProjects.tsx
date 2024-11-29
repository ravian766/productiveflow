'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FolderIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { AssignProjectDialog } from './AssignProjectDialog';

interface Project {
  id: string;
  name: string;
  tasks: {
    id: string;
    status: string;
  }[];
}

interface TeamProjectsProps {
  teamId: string;
  projects: Project[];
}

export function TeamProjects({ teamId, projects }: TeamProjectsProps) {
  const router = useRouter();
  const [isAssigning, setIsAssigning] = useState(false);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);

  const handleAssignProject = async (projectId: string) => {
    setIsAssigning(true);
    try {
      const response = await fetch(`/api/teams/${teamId}/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ projectId }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to assign project to team');
      }

      toast.success('Project assigned to team successfully');
      router.refresh();
    } catch (error) {
      console.error('Project assignment error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to assign project to team');
    } finally {
      setIsAssigning(false);
    }
  };

  const handleRemoveProject = async (projectId: string) => {
    try {
      const response = await fetch(`/api/teams/${teamId}/projects/${projectId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to remove project from team');
      }

      toast.success('Project removed from team successfully');
      router.refresh();
    } catch (error) {
      toast.error('Failed to remove project from team');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Team Projects</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setIsAssignDialogOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Assign Project
          </button>
          <Link
            href={`/dashboard/projects/new?teamId=${teamId}`}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            New Project
          </Link>
        </div>
      </div>

      <AssignProjectDialog
        isOpen={isAssignDialogOpen}
        onClose={() => setIsAssignDialogOpen(false)}
        teamId={teamId}
        onAssign={handleAssignProject}
        currentProjects={projects}
      />

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul role="list" className="divide-y divide-gray-200">
          {projects.map((project) => {
            const completedTasks = project.tasks.filter(
              (task) => task.status === 'COMPLETED'
            ).length;
            const progress = project.tasks.length
              ? Math.round((completedTasks / project.tasks.length) * 100)
              : 0;

            return (
              <li key={project.id}>
                <div className="px-4 py-4 flex items-center sm:px-6">
                  <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <FolderIcon className="h-8 w-8 text-gray-400" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-blue-600 truncate">
                          {project.name}
                        </div>
                        <div className="mt-1">
                          <div className="text-xs text-gray-500">
                            {project.tasks.length} tasks · {completedTasks} completed
                          </div>
                          <div className="mt-1 w-48 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-blue-600 rounded-full"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="ml-5 flex-shrink-0 flex items-center space-x-2">
                    <Link
                      href={`/dashboard/projects/${project.id}`}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      View details
                      <ChevronRightIcon className="ml-2 h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => handleRemoveProject(project.id)}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
