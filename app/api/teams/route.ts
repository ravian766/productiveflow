import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

const createTeamSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const user = await auth();
    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const json = await req.json();
    const body = createTeamSchema.parse(json);

    // Get user's organization
    const userOrg = await prisma.user.findUnique({
      where: { id: user.id },
      select: { organization: true },
    });

    if (!userOrg?.organization.id) {
      return new NextResponse('User not associated with an organization', { status: 400 });
    }

    const team = await prisma.team.create({
      data: {
        name: body.name,
        description: body.description,
        orgId: userOrg.organization.id,
        members: {
          create: {
            userId: user.id,
            role: 'ADMIN',
          },
        },
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(team);
  } catch (error) {
    console.error('Error creating team:', error);
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify(error.errors), { status: 400 });
    }
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const user = await auth();
    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const teams = await prisma.team.findMany({
      where: {
        organization: {
          users: {
            some: {
              id: user.id,
            },
          },
        },
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        projects: {
          select: {
            id: true,
            name: true,
            tasks: {
              select: {
                id: true,
                status: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(teams);
  } catch (error) {
    console.error('Error fetching teams:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
