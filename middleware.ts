import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';
import { withOrganization } from './middleware/organization';

const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET || process.env.SECRET_KEY);

export async function middleware(request: NextRequest) {
  // Don't redirect API routes
  if (request.nextUrl.pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  const token = request.cookies.get('session-token');

  if (!token) {
    return NextResponse.redirect(new URL('/auth/signin', request.url));
  }

  try {
    await jwtVerify(token.value, secret);
    
    // Check organization status
    const orgCheck = await withOrganization(request);
    if (orgCheck) {
      return orgCheck;
    }

    return NextResponse.next();
  } catch (error) {
    return NextResponse.redirect(new URL('/auth/signin', request.url));
  }
}

export const config = {
  matcher: [
    '/',
    '/dashboard/:path*',
    '/settings/:path*',
    '/profile/:path*',
    '/api/projects/:path*',
    '/api/tasks/:path*',
    '/api/analytics/:path*'
  ]
}