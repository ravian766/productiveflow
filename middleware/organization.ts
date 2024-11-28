import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSession } from '@/lib/session';

export async function withOrganization(request: NextRequest) {
  const session = await getSession();
  
  // If no session or no user, let the auth middleware handle it
  if (!session?.user) {
    return null;
  }

  // If user has no organization and isn't already on the org creation page
  if (!session.user.orgId && 
      !request.nextUrl.pathname.startsWith('/dashboard/organization/new')) {
    return NextResponse.redirect(new URL('/dashboard/organization/new', request.url));
  }

  return NextResponse.next();
}
