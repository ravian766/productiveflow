'use client';

import { useState } from 'react';
import {
  CalendarIcon,
  TagIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import TaskModal from './TaskModal';
import { Task, TaskStatus, TaskPriority } from '@/types';

export interface TaskCardProps {
  task: Task;
  onUpdate: () => void;
}

const statusColors = {
  [TaskStatus.TODO]: 'bg-gray-100 text-gray-800',
  [TaskStatus.IN_PROGRESS]: 'bg-blue-100 text-blue-800',
  [TaskStatus.REVIEW]: 'bg-yellow-100 text-yellow-800',
  [TaskStatus.COMPLETED]: 'bg-green-100 text-green-800',
};

const priorityColors = {
  [TaskPriority.LOW]: 'bg-green-100 text-green-800',
  [TaskPriority.MEDIUM]: 'bg-yellow-100 text-yellow-800',
  [TaskPriority.HIGH]: 'bg-red-100 text-red-800',
};

export function TaskCard({ task, onUpdate }: TaskCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
        onClick={() => setIsModalOpen(true)}
      >
        <div className="space-y-3">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-medium text-gray-900 truncate flex-1">
              {task.title}
            </h3>
          </div>

          <div className="flex flex-wrap gap-2">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                statusColors[task.status]
              }`}
            >
              {task.status.replace(/_/g, ' ')}
            </span>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                priorityColors[task.priority]
              }`}
            >
              {task.priority}
            </span>
          </div>

          {task.description && (
            <p className="text-sm text-gray-500 line-clamp-2">{task.description}</p>
          )}

          <div className="flex items-center space-x-4 text-sm text-gray-500">
            {task.project && (
              <div className="flex items-center">
                <TagIcon className="h-4 w-4 mr-1" />
                <span>{task.project.name}</span>
              </div>
            )}

            {task.assignee && (
              <div className="flex items-center">
                <UserCircleIcon className="h-4 w-4 mr-1" />
                <span>{task.assignee.name || task.assignee.email}</span>
              </div>
            )}

            {task.dueDate && (
              <div className="flex items-center">
                <CalendarIcon className="h-4 w-4 mr-1" />
                <span>
                  {new Date(task.dueDate).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>

          {task.tags && task.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {task.tags.map((tag) => (
                <span
                  key={tag.id}
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium`}
                  style={{
                    backgroundColor: `${tag.color}20`,
                    color: tag.color,
                  }}
                >
                  {tag.name}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        task={task}
        onUpdate={() => {
          onUpdate();
          setIsModalOpen(false);
        }}
      />
    </>
  );
}
