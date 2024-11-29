'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: string;
  isConnected: boolean;
}

const availableIntegrations: Integration[] = [
  {
    id: 'github',
    name: 'GitHub',
    description: 'Connect your GitHub repositories to sync issues and pull requests.',
    icon: '🐙',
    isConnected: false,
  },
  {
    id: 'slack',
    name: 'Slack',
    description: 'Get notifications and updates directly in your Slack workspace.',
    icon: '💬',
    isConnected: false,
  },
  {
    id: 'google',
    name: 'Google Calendar',
    description: 'Sync your tasks and deadlines with Google Calendar.',
    icon: '📅',
    isConnected: false,
  },
  {
    id: 'discord',
    name: 'Discord',
    description: 'Receive notifications and updates in your Discord server.',
    icon: '🎮',
    isConnected: false,
  },
];

interface User {
  id: string;
}

export function IntegrationSettings({ currentUser }: { currentUser: User }) {
  const router = useRouter();
  const [integrations, setIntegrations] = useState(availableIntegrations);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleToggleIntegration = async (integrationId: string) => {
    setIsSubmitting(true);
    const integration = integrations.find((i) => i.id === integrationId);
    
    try {
      const response = await fetch(`/api/integrations/${integrationId}`, {
        method: integration?.isConnected ? 'DELETE' : 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to update integration');
      }

      setIntegrations((prev) =>
        prev.map((i) =>
          i.id === integrationId ? { ...i, isConnected: !i.isConnected } : i
        )
      );

      toast.success(
        `${integration?.name} ${
          integration?.isConnected ? 'disconnected' : 'connected'
        } successfully`
      );
    } catch (error) {
      console.error('Error updating integration:', error);
      toast.error('Failed to update integration');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium leading-6 text-gray-900">Integrations</h3>
        <p className="mt-1 text-sm text-gray-500">
          Connect your favorite tools and services.
        </p>
      </div>

      <div className="space-y-4">
        {integrations.map((integration) => (
          <div
            key={integration.id}
            className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200"
          >
            <div className="flex items-center space-x-4">
              <div className="text-2xl">{integration.icon}</div>
              <div>
                <h4 className="text-sm font-medium text-gray-900">
                  {integration.name}
                </h4>
                <p className="text-sm text-gray-500">{integration.description}</p>
              </div>
            </div>
            <button
              onClick={() => handleToggleIntegration(integration.id)}
              disabled={isSubmitting}
              className={`inline-flex items-center px-3 py-2 border text-sm font-medium rounded-md ${
                integration.isConnected
                  ? 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                  : 'border-transparent text-white bg-blue-600 hover:bg-blue-700'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50`}
            >
              {integration.isConnected ? 'Disconnect' : 'Connect'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
