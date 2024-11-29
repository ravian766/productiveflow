'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface Organization {
  id: string;
  name: string;
}

interface User {
  id: string;
  role: string;
}

interface OrganizationSettingsProps {
  currentUser: User;
  organization: Organization | null;
}

export function OrganizationSettings({ currentUser, organization }: OrganizationSettingsProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: organization?.name || '',
  });

  const isAdmin = currentUser.role === 'ADMIN';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) return;
    
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/organizations/${organization?.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to update organization');
      }

      toast.success('Organization updated successfully');
      router.refresh();
    } catch (error) {
      console.error('Error updating organization:', error);
      toast.error('Failed to update organization');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium leading-6 text-gray-900">Organization Settings</h3>
        <p className="mt-1 text-sm text-gray-500">
          Manage your organization details and preferences.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="orgName"
            className="block text-sm font-medium text-gray-700"
          >
            Organization Name
          </label>
          <input
            type="text"
            id="orgName"
            name="orgName"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            disabled={!isAdmin}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
          {!isAdmin && (
            <p className="mt-1 text-sm text-gray-500">
              Only administrators can modify organization settings.
            </p>
          )}
        </div>

        {isAdmin && (
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
