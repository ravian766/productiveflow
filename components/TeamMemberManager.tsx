'use client';

import { useState } from 'react';
import { UserIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface TeamMember {
  id: string;
  role: 'ADMIN' | 'MEMBER' | 'VIEWER';
  user: {
    id: string;
    name: string | null;
    email: string;
    profileImage: string | null;
  };
}

interface TeamMemberManagerProps {
  teamId: string;
  members: TeamMember[];
  currentUserId: string;
}

export function TeamMemberManager({ teamId, members, currentUserId }: TeamMemberManagerProps) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'ADMIN' | 'MEMBER' | 'VIEWER'>('MEMBER');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/teams/${teamId}/members`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, role }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }

      toast.success('Team member added successfully');
      setEmail('');
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to add team member');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateRole = async (memberId: string, newRole: 'ADMIN' | 'MEMBER' | 'VIEWER') => {
    try {
      const response = await fetch(`/api/teams/${teamId}/members`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ memberId, role: newRole }),
      });

      if (!response.ok) {
        throw new Error('Failed to update member role');
      }

      toast.success('Member role updated successfully');
      router.refresh();
    } catch (error) {
      toast.error('Failed to update member role');
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    try {
      const response = await fetch(`/api/teams/${teamId}/members?memberId=${memberId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to remove team member');
      }

      toast.success('Team member removed successfully');
      router.refresh();
    } catch (error) {
      toast.error('Failed to remove team member');
    }
  };

  const isCurrentUserAdmin = members.some(
    (member) => member.user.id === currentUserId && member.role === 'ADMIN'
  );

  return (
    <div className="space-y-6">
      {isCurrentUserAdmin && (
        <form onSubmit={handleAddMember} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="col-span-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="Enter email address"
                required
              />
            </div>
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                Role
              </label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value as 'ADMIN' | 'MEMBER' | 'VIEWER')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="ADMIN">Admin</option>
                <option value="MEMBER">Member</option>
                <option value="VIEWER">Viewer</option>
              </select>
            </div>
          </div>
          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isSubmitting ? 'Adding...' : 'Add Member'}
            </button>
          </div>
        </form>
      )}

      <div className="mt-6">
        <h3 className="text-lg font-medium text-gray-900">Team Members</h3>
        <div className="mt-4 divide-y divide-gray-200">
          {members.map((member) => (
            <div key={member.id} className="flex items-center justify-between py-4">
              <div className="flex items-center min-w-0">
                {member.user.profileImage ? (
                  <img
                    src={member.user.profileImage}
                    alt={member.user.name || member.user.email}
                    className="h-10 w-10 rounded-full"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <UserIcon className="h-6 w-6 text-gray-500" />
                  </div>
                )}
                <div className="ml-4 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {member.user.name || member.user.email}
                  </p>
                  <p className="text-sm text-gray-500 truncate">{member.user.email}</p>
                </div>
              </div>
              <div className="ml-4 flex items-center space-x-4">
                {isCurrentUserAdmin && member.user.id !== currentUserId && (
                  <>
                    <select
                      value={member.role}
                      onChange={(e) =>
                        handleUpdateRole(member.id, e.target.value as 'ADMIN' | 'MEMBER' | 'VIEWER')
                      }
                      className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    >
                      <option value="ADMIN">Admin</option>
                      <option value="MEMBER">Member</option>
                      <option value="VIEWER">Viewer</option>
                    </select>
                    <button
                      onClick={() => handleRemoveMember(member.id)}
                      className="text-sm text-red-600 hover:text-red-900"
                    >
                      Remove
                    </button>
                  </>
                )}
                {(!isCurrentUserAdmin || member.user.id === currentUserId) && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {member.role.charAt(0).toUpperCase() + member.role.slice(1).toLowerCase()}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
