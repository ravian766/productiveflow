import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const session = await getSession();
    
    if (!session?.user) {
      return NextResponse.json({ authorized: false }, { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        orgId: true,
        role: true,
      },
    });

    if (!user) {
      return NextResponse.json({ authorized: false }, { status: 401 });
    }

    // Check organization status
    if (!user.orgId) {
      return NextResponse.json({ 
        authorized: true, 
        needsOrg: true 
      });
    }

    return NextResponse.json({ 
      authorized: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        orgId: user.orgId,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json({ authorized: false }, { status: 401 });
  }
}
