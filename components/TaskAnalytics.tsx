'use client';

import { Task, TaskStatus, TaskPriority } from '@/types';

interface TaskAnalyticsProps {
  tasks: Task[];
}

export default function TaskAnalytics({ tasks }: TaskAnalyticsProps) {
  // Calculate completion rate
  const completedTasks = tasks.filter((task) => task.status === TaskStatus.COMPLETED).length;
  const completionRate = tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0;

  // Calculate task distribution by status
  const tasksByStatus = Object.values(TaskStatus).map((status) => ({
    status,
    count: tasks.filter((task) => task.status === status).length,
  }));

  // Calculate task distribution by priority
  const tasksByPriority = Object.values(TaskPriority).map((priority) => ({
    priority,
    count: tasks.filter((task) => task.priority === priority).length,
  }));

  // Calculate overdue tasks
  const overdueTasks = tasks.filter(
    (task) => task.dueDate && new Date(task.dueDate) < new Date() && task.status !== TaskStatus.COMPLETED
  ).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Completion Rate */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h3 className="text-sm font-medium text-gray-500">Completion Rate</h3>
        <div className="mt-2 flex items-baseline">
          <p className="text-2xl font-semibold text-gray-900">{completionRate.toFixed(1)}%</p>
          <p className="ml-2 text-sm text-gray-500">of tasks completed</p>
        </div>
        <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-green-600 h-2 rounded-full"
            style={{ width: `${completionRate}%` }}
          />
        </div>
      </div>

      {/* Task Distribution */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h3 className="text-sm font-medium text-gray-500">Task Distribution</h3>
        <div className="mt-2 space-y-2">
          {tasksByStatus.map(({ status, count }) => (
            <div key={status} className="flex justify-between items-center">
              <span className="text-sm text-gray-600">{status.replace('_', ' ')}</span>
              <span className="text-sm font-medium text-gray-900">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Priority Distribution */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h3 className="text-sm font-medium text-gray-500">Priority Distribution</h3>
        <div className="mt-2 space-y-2">
          {tasksByPriority.map(({ priority, count }) => (
            <div key={priority} className="flex justify-between items-center">
              <span className="text-sm text-gray-600">{priority}</span>
              <span className="text-sm font-medium text-gray-900">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Overdue Tasks */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h3 className="text-sm font-medium text-gray-500">Overdue Tasks</h3>
        <div className="mt-2 flex items-baseline">
          <p className="text-2xl font-semibold text-gray-900">{overdueTasks}</p>
          <p className="ml-2 text-sm text-gray-500">tasks overdue</p>
        </div>
        {overdueTasks > 0 && (
          <p className="mt-2 text-sm text-red-600">
            Action needed: {overdueTasks} task{overdueTasks === 1 ? ' is' : 's are'} past due date
          </p>
        )}
      </div>
    </div>
  );
}
