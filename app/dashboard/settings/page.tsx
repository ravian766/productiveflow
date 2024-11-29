import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { PageHeader } from '@/components/PageHeader';
import { SettingsTabs } from '@/components/SettingsTabs';
import { ThemeSettings } from '@/components/ThemeSettings';

export default async function SettingsPage() {
  const user = await auth();
  if (!user?.orgId) return null;

  const organization = await db.organization.findUnique({
    where: { id: user.orgId },
    select: {
      id: true,
      name: true,
    },
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Manage your account and organization settings"
      />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto space-y-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Settings
          </h1>
          
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <ThemeSettings />
          </div>
          
          <SettingsTabs currentUser={user} organization={organization} />
        </div>
      </div>
    </div>
  );
}
