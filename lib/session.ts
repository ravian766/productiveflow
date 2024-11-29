import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';

const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET || process.env.SECRET_KEY);

interface JWTPayload {
  user: {
    id: string;
    email: string | null;
    name: string | null;
    orgId: string | null;
  };
}

interface User {
  id: string;
  email: string | null;
  name: string | null;
  orgId: string | null;
}

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
    maxAge: 60 * 60 * 24 // 24 hours
  });

  return token;
}

export async function getSession(): Promise<JWTPayload | null> {
  const token = cookies().get('session-token');

  if (!token) {
    return null;
  }

  try {
    const verified = await jwtVerify(token.value, secret);
    return verified.payload as unknown as JWTPayload;
  } catch (error) {
    return null;
  }
}

export async function clearSession() {
  cookies().delete('session-token');
}