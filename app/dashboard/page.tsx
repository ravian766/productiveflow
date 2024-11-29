'use client';

import { useState, useEffect } from 'react';
import { 
  ChartBarIcon, 
  ClockIcon, 
  UserGroupIcon, 
  FlagIcon,
  CheckCircleIcon,
  ExclamationCircleIcon 
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';

interface DashboardData {
  tasks: {
    total: number;
    byStatus: {
      [key: string]: number;
    };
    byPriority: {
      [key: string]: number;
    };
    overdue: number;
    dueThisWeek: number;
  };
  projects: {
    total: number;
    active: number;
    completed: number;
    recent: Array<{
      id: string;
      name: string;
      status: string;
      progress: number;
    }>;
  };
  team: {
    totalMembers: number;
    recentActivities: Array<{
      id: string;
      user: string;
      action: string;
      target: string;
      timestamp: string;
    }>;
    taskDistribution: Array<{
      user: string;
      tasks: number;
    }>;
  };
}

function DashboardPage() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/dashboard');
      if (!response.ok) throw new Error('Failed to fetch dashboard data');
      const data = await response.json();
      setDashboardData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-6">
        <ExclamationCircleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-sm text-gray-500">
          Last updated: {format(new Date(), 'PPp')}
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex items-center space-x-3">
            <ChartBarIcon className="h-8 w-8 text-primary-500" />
            <div>
              <p className="text-sm font-medium text-gray-600">Total Tasks</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardData?.tasks.total}</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex items-center space-x-3">
            <CheckCircleIcon className="h-8 w-8 text-green-500" />
            <div>
              <p className="text-sm font-medium text-gray-600">Completed Tasks</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardData?.tasks.byStatus.COMPLETED}</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex items-center space-x-3">
            <ClockIcon className="h-8 w-8 text-yellow-500" />
            <div>
              <p className="text-sm font-medium text-gray-600">Due This Week</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardData?.tasks.dueThisWeek}</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex items-center space-x-3">
            <FlagIcon className="h-8 w-8 text-red-500" />
            <div>
              <p className="text-sm font-medium text-gray-600">Overdue</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardData?.tasks.overdue}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Project Overview */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Projects</h2>
          <div className="space-y-4">
            {dashboardData?.projects.recent.map((project) => (
              <div key={project.id} className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">{project.name}</h3>
                  <p className="text-sm text-gray-500">{project.status}</p>
                </div>
                <div className="w-24">
                  <div className="h-2 rounded-full bg-gray-200">
                    <div
                      className="h-2 rounded-full bg-primary-500"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Team Activity</h2>
          <div className="space-y-4">
            {dashboardData?.team.recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <UserGroupIcon className="h-5 w-5 text-gray-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-900">
                    <span className="font-medium">{activity.user}</span> {activity.action}{' '}
                    <span className="font-medium">{activity.target}</span>
                  </p>
                  <p className="text-xs text-gray-500">{format(new Date(activity.timestamp), 'PPp')}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Task Distribution */}
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Task Distribution</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {dashboardData?.team.taskDistribution.map((member) => (
            <div key={member.user} className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-900">{member.user}</span>
              <span className="text-sm text-gray-500">{member.tasks} tasks</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;