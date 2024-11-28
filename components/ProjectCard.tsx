'use client';

import { FC } from 'react';
import Link from 'next/link';
import { ChartBarIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';
import { ProjectMenu } from './ProjectMenu';

interface ProjectCardProps {
  project: {
    id: string;
    name: string;
    description?: string | null;
    tasks: { id: string; status: string; }[];
    users: { id: string; name: string | null; email: string; }[];
  };
}

export const ProjectCard: FC<ProjectCardProps> = ({ project }) => {
  const completedTasks = project.tasks.filter(task => task.status === 'COMPLETED').length;
  const totalTasks = project.tasks.length;
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <div className="group relative flex flex-col justify-between rounded-lg border p-5 hover:shadow-md transition-shadow">
      <div className="absolute top-4 right-4">
        <ProjectMenu projectId={project.id} />
      </div>
      
      <div>
        <Link href={`/dashboard/projects/${project.id}`}>
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600">
            {project.name}
          </h3>
        </Link>
        {project.description && (
          <p className="mt-2 text-sm text-gray-600 line-clamp-2">{project.description}</p>
        )}
      </div>

      <div className="mt-4 flex flex-col space-y-3">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center text-gray-500">
            <ChartBarIcon className="mr-1.5 h-4 w-4" />
            <span>
              {completedTasks} of {totalTasks} tasks completed
            </span>
          </div>
          <div className="flex items-center text-gray-500">
            <UserGroupIcon className="mr-1.5 h-4 w-4" />
            <span>{project.users.length}</span>
          </div>
        </div>

        <div className="h-2 w-full rounded-full bg-gray-200">
          <div
            className={cn(
              "h-full rounded-full transition-all",
              progress === 100 ? "bg-green-500" : "bg-blue-500"
            )}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};
