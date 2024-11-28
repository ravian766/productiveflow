import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { z } from 'zod';

const organizationSchema = z.object({
  name: z.string().min(1, 'Organization name is required'),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const json = await req.json();
    const body = organizationSchema.parse(json);

    // Create organization and update user in a transaction
    const result = await prisma.$transaction(async (tx) => {
      const org = await tx.organization.create({
        data: {
          name: body.name,
          users: {
            connect: { id: session.user.id }
          }
        },
      });

      // Update user's organization
      await tx.user.update({
        where: { id: session.user.id },
        data: { orgId: org.id }
      });

      return org;
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Organization creation error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid organization data' }, { status: 400 });
    }
    return NextResponse.json(
      { error: 'Failed to create organization' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const org = await prisma.organization.findFirst({
      where: {
        users: {
          some: {
            id: session.user.id
          }
        }
      },
      include: {
        users: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        projects: {
          select: {
            id: true,
            name: true,
            tasks: {
              select: {
                id: true,
                status: true
              }
            }
          }
        }
      }
    });

    if (!org) {
      return NextResponse.json(null);
    }

    return NextResponse.json(org);
  } catch (error) {
    console.error('Error fetching organization:', error);
    return NextResponse.json(
      { error: 'Failed to fetch organization' },
      { status: 500 }
    );
  }
}
