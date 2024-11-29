import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';
import { User } from '@prisma/client';
import { prisma } from './prisma';

interface JWTPayload {
  user: {
    id: string;
    email: string | null;
    name: string | null;
    orgId: string | null;
  };
}

const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET || process.env.SECRET_KEY);

export async function createSession(user: Partial<User>) {
  const token = await new SignJWT({ 
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      orgId: user.orgId
    }
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('24h')
    .sign(secret);

  cookies().set('session-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 86400 // 24 hours
  });

  return token;
}

export async function getSession() {
  const token = cookies().get('session-token');
  
  if (!token) return null;
  
  try {
    const { payload } = await jwtVerify<JWTPayload>(token.value, secret);
    const user = await prisma.user.findUnique({
      where: { id: payload.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        orgId: true,
        role: true,
      },
    });
    
    if (!user) return null;
    
    return {
      user: {
        id: user.id,
        email: user.email || '',
        name: user.name,
        orgId: user.orgId || '',
        role: user.role
      }
    };
  } catch (err) {
    console.error('Session error:', err);
    return null;
  }
}

export async function clearSession() {
  cookies().delete('session-token');
}