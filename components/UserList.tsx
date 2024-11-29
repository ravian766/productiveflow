'use client';

import { useState } from 'react';
import { UserIcon } from '@heroicons/react/24/outline';
import { InviteUserDialog } from './InviteUserDialog';

interface Team {
  id: string;
  name: string;
}

interface TeamMembership {
  team: Team;
  role: string;
}

interface User {
  id: string;
  name: string | null;
  email: string;
  role: string;
  teamMemberships: TeamMembership[];
}

interface UserListProps {
  users: User[];
  currentUserId: string;
}

export function UserList({ users, currentUserId }: UserListProps) {
  const [isInviteOpen, setIsInviteOpen] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">Organization Members</h2>
        <button
          onClick={() => setIsInviteOpen(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
        >
          Invite User
        </button>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul role="list" className="divide-y divide-gray-200">
          {users.map((user) => (
            <li key={user.id}>
              <div className="px-4 py-4 flex items-center sm:px-6">
                <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      {user.name ? (
                        <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-xl font-medium text-blue-600">
                            {user.name[0].toUpperCase()}
                          </span>
                        </div>
                      ) : (
                        <UserIcon className="h-12 w-12 text-gray-400" />
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="flex items-center">
                        <h3 className="text-sm font-medium text-gray-900">
                          {user.name || 'Unnamed User'}
                        </h3>
                        {user.id === currentUserId && (
                          <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            You
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">{user.email}</p>
                      <p className="mt-1 text-xs text-gray-500">
                        Role: {user.role.toLowerCase()}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 sm:mt-0">
                    <div className="flex flex-wrap gap-2">
                      {user.teamMemberships.map((membership) => (
                        <span
                          key={membership.team.id}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                        >
                          {membership.team.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <InviteUserDialog
        isOpen={isInviteOpen}
        onClose={() => setIsInviteOpen(false)}
      />
    </div>
  );
}
