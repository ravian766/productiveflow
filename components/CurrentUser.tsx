import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function getCurrentUser() {
  try {
    const user = await auth();
    if (!user?.id) return null;

    const fullUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        name: true,
        email: true,
        profileImage: true,
      },
    });

    return fullUser;
  } catch (error) {
    console.error('Error fetching current user:', error);
    return null;
  }
}
