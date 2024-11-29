import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { PageHeader } from '@/components/PageHeader';
import { SettingsTabs } from '@/components/SettingsTabs';

export default async function SettingsPage() {
  const user = await auth();
  if (!user?.orgId) return null;

  const organization = await prisma.organization.findUnique({
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
      <SettingsTabs currentUser={user} organization={organization} />
    </div>
  );
}
