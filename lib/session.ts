import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';
import { User } from '@prisma/client';

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
    const verified = await jwtVerify(token.value, secret);
    return verified.payload as { user: { id: string; email: string; name: string | null; orgId: string } };
  } catch (err) {
    return null;
  }
}

export async function clearSession() {
  cookies().delete('session-token');
}