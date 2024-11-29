import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { UserList } from '@/components/UserList';
import { PageHeader } from '@/components/PageHeader';

export default async function UsersPage() {
  const user = await auth();
  if (!user?.orgId) return null;

  const users = await prisma.user.findMany({
    where: {
      orgId: user.orgId,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      teamMemberships: {
        include: {
          team: true,
        },
      },
    },
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Users"
        description="Manage users in your organization"
      />
      <UserList users={users} currentUserId={user.id} />
    </div>
  );
}
