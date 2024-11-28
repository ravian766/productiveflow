'use client';

import { useState, useEffect } from 'react';
import { TaskStatus, TaskPriority } from '@prisma/client';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  priority: TaskPriority;
  createdAt: Date;
  dueDate?: Date | null;
  project: {
    id: string;
    name: string;
  };
}

interface Project {
  id: string;
  name: string;
  tasks: Task[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
const PRIORITY_COLORS = {
  HIGH: '#EF4444',
  MEDIUM: '#F59E0B',
  LOW: '#10B981',
};

export default function GlobalAnalytics() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTimeRange, setSelectedTimeRange] = useState<'week' | 'month' | 'year'>('month');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/analytics');
        if (!response.ok) {
          throw new Error('Failed to fetch analytics data');
        }
        const data = await response.json();
        setProjects(data.projects);
        setTasks(data.tasks);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-4">
        {error}
      </div>
    );
  }

  // Calculate key metrics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.status === TaskStatus.COMPLETED).length;
  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  const overdueTasks = tasks.filter(
    task => task.dueDate && new Date(task.dueDate) < new Date() && task.status !== TaskStatus.COMPLETED
  ).length;

  // Prepare data for charts
  const statusData = Object.values(TaskStatus).map(status => ({
    name: status.replace('_', ' '),
    value: tasks.filter(task => task.status === status).length,
  }));

  const priorityData = Object.values(TaskPriority).map(priority => ({
    name: priority,
    value: tasks.filter(task => task.priority === priority).length,
  }));

  const projectTasksData = projects.map(project => ({
    name: project.name,
    total: project.tasks.length,
    completed: project.tasks.filter(task => task.status === TaskStatus.COMPLETED).length,
  }));

  // Calculate trend data based on selected time range
  const getTrendData = () => {
    const now = new Date();
    const periods = {
      week: 7,
      month: 30,
      year: 12,
    };

    if (selectedTimeRange === 'year') {
      // Monthly data for the year
      return Array.from({ length: 12 }, (_, i) => {
        const month = new Date(now.getFullYear(), i);
        const monthTasks = tasks.filter(task => {
          const taskDate = new Date(task.createdAt);
          return taskDate.getMonth() === month.getMonth() &&
                 taskDate.getFullYear() === month.getFullYear();
        });
        return {
          name: month.toLocaleString('default', { month: 'short' }),
          tasks: monthTasks.length,
          completed: monthTasks.filter(task => task.status === TaskStatus.COMPLETED).length,
        };
      });
    } else {
      // Daily data for week/month
      return Array.from({ length: periods[selectedTimeRange] }, (_, i) => {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        const dayTasks = tasks.filter(task => {
          const taskDate = new Date(task.createdAt);
          return taskDate.toDateString() === date.toDateString();
        });
        return {
          name: date.toLocaleDateString('default', { month: 'short', day: 'numeric' }),
          tasks: dayTasks.length,
          completed: dayTasks.filter(task => task.status === TaskStatus.COMPLETED).length,
        };
      }).reverse();
    }
  };

  const trendData = getTrendData();

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Total Tasks</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900">{totalTasks}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Completion Rate</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900">{completionRate.toFixed(1)}%</p>
          <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-600 h-2 rounded-full"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Active Projects</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900">{projects.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Overdue Tasks</h3>
          <p className="mt-2 text-3xl font-semibold text-red-600">{overdueTasks}</p>
        </div>
      </div>

      {/* Task Trend Chart */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Task Trend</h3>
          <div className="flex gap-2">
            {(['week', 'month', 'year'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setSelectedTimeRange(range)}
                className={`px-3 py-1 rounded-md text-sm ${
                  selectedTimeRange === range
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="tasks" name="Total Tasks" fill="#6366F1" />
              <Bar dataKey="completed" name="Completed Tasks" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Status and Priority Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Task Status Distribution</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {statusData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Task Priority Distribution</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={priorityData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {priorityData.map((entry) => (
                    <Cell key={`cell-${entry.name}`} fill={PRIORITY_COLORS[entry.name]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Project Progress */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Project Progress</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={projectTasksData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="total" name="Total Tasks" fill="#6366F1" />
              <Bar dataKey="completed" name="Completed Tasks" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
