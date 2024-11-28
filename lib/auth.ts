import { getSession } from './session';
import { redirect } from 'next/navigation';
import { User } from '@prisma/client';
import { prisma } from './prisma';
import bcrypt from 'bcryptjs';

export type Session = {
  user: {
    id: string;
    email: string;
    name: string | null;
    orgId: string;
  }
};

export type AuthUser = Session['user'];

export async function getCurrentUser(): Promise<AuthUser | null> {
  const session = await getSession();
  return session?.user || null;
}

export const auth = () => getCurrentUser();

export async function requireAuth(): Promise<AuthUser> {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/auth/signin');
  }
  return user;
}
;