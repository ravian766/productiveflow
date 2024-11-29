'use client';

import { useState } from 'react';
import { Tab } from '@headlessui/react';
import { ProfileSettings } from './settings/ProfileSettings';
import { OrganizationSettings } from './settings/OrganizationSettings';
import { NotificationSettings } from './settings/NotificationSettings';
import { SecuritySettings } from './settings/SecuritySettings';
import { IntegrationSettings } from './settings/IntegrationSettings';
import { BillingSettings } from './settings/BillingSettings';

interface User {
  id: string;
  name: string | null;
  email: string;
  role: string;
}

interface Organization {
  id: string;
  name: string;
}

interface SettingsTabsProps {
  currentUser: User;
  organization: Organization | null;
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export function SettingsTabs({ currentUser, organization }: SettingsTabsProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const tabs = [
    { name: 'Profile', component: ProfileSettings },
    { name: 'Organization', component: OrganizationSettings },
    { name: 'Notifications', component: NotificationSettings },
    { name: 'Security', component: SecuritySettings },
    { name: 'Integrations', component: IntegrationSettings },
    { name: 'Billing', component: BillingSettings },
  ];

  return (
    <div className="w-full">
      <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
        <Tab.List className="flex space-x-1 rounded-xl bg-gray-100 p-1">
          {tabs.map((tab) => (
            <Tab
              key={tab.name}
              className={({ selected }) =>
                classNames(
                  'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                  'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                  selected
                    ? 'bg-white text-blue-700 shadow'
                    : 'text-gray-600 hover:bg-white/[0.12] hover:text-blue-600'
                )
              }
            >
              {tab.name}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels className="mt-4">
          {tabs.map((tab, idx) => (
            <Tab.Panel
              key={idx}
              className={classNames(
                'rounded-xl bg-white p-6',
                'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2'
              )}
            >
              <tab.component currentUser={currentUser} organization={organization} />
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}
