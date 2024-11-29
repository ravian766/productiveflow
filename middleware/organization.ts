import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET || process.env.SECRET_KEY);

export async function withOrganization(request: NextRequest) {
  const token = request.cookies.get('session-token');
  
  if (!token) {
    return null;
  }

  try {
    const verified = await jwtVerify(token.value, secret);
    const payload = verified.payload as any;
    
    // If user has no organization and isn't already on the org creation page
    if (!payload.user?.orgId && 
        !request.nextUrl.pathname.startsWith('/dashboard/organization/new')) {
      return NextResponse.redirect(new URL('/dashboard/organization/new', request.url));
    }

    return NextResponse.next();
  } catch (error) {
    return null;
  }
}
