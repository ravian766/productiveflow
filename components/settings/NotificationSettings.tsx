'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface NotificationSetting {
  id: string;
  label: string;
  description: string;
  key: string;
}

const notificationSettings: NotificationSetting[] = [
  {
    id: '1',
    label: 'Task Assignments',
    description: 'Receive notifications when you are assigned to a task',
    key: 'taskAssignments',
  },
  {
    id: '2',
    label: 'Task Updates',
    description: 'Receive notifications when tasks you are assigned to are updated',
    key: 'taskUpdates',
  },
  {
    id: '3',
    label: 'Project Updates',
    description: 'Receive notifications about updates to projects you are a member of',
    key: 'projectUpdates',
  },
  {
    id: '4',
    label: 'Team Updates',
    description: 'Receive notifications about updates to your teams',
    key: 'teamUpdates',
  },
  {
    id: '5',
    label: 'Due Date Reminders',
    description: 'Receive reminders about upcoming task due dates',
    key: 'dueDateReminders',
  },
];

interface User {
  id: string;
}

export function NotificationSettings({ currentUser }: { currentUser: User }) {
  const router = useRouter();
  const [settings, setSettings] = useState<Record<string, boolean>>({
    taskAssignments: true,
    taskUpdates: true,
    projectUpdates: true,
    teamUpdates: true,
    dueDateReminders: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleToggle = (key: string) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/user/notifications', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ settings }),
      });

      if (!response.ok) {
        throw new Error('Failed to update notification settings');
      }

      toast.success('Notification settings updated successfully');
    } catch (error) {
      console.error('Error updating notification settings:', error);
      toast.error('Failed to update notification settings');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium leading-6 text-gray-900">Notification Preferences</h3>
        <p className="mt-1 text-sm text-gray-500">
          Choose what notifications you want to receive.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          {notificationSettings.map((setting) => (
            <div key={setting.id} className="relative flex items-start">
              <div className="flex h-5 items-center">
                <input
                  id={setting.id}
                  type="checkbox"
                  checked={settings[setting.key]}
                  onChange={() => handleToggle(setting.key)}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </div>
              <div className="ml-3">
                <label htmlFor={setting.id} className="text-sm font-medium text-gray-700">
                  {setting.label}
                </label>
                <p className="text-sm text-gray-500">{setting.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : 'Save Preferences'}
          </button>
        </div>
      </form>
    </div>
  );
}
