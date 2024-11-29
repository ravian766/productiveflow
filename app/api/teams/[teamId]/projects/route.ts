import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

const assignProjectSchema = z.object({
  projectId: z.string(),
});

export async function POST(
  req: NextRequest,
  { params }: { params: { teamId: string } }
) {
  try {
    const user = await auth();
    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const json = await req.json();
    const body = assignProjectSchema.parse(json);

    // Check if current user is team admin
    const currentMember = await prisma.teamMember.findFirst({
      where: {
        teamId: params.teamId,
        userId: user.id,
        role: 'ADMIN',
      },
      include: {
        team: {
          include: {
            organization: true,
            projects: true,
          },
        },
      },
    });

    if (!currentMember) {
      return new NextResponse('Forbidden', { status: 403 });
    }

    // Check if project exists and belongs to user's organization
    const project = await prisma.project.findFirst({
      where: {
        id: body.projectId,
        orgId: currentMember.team.organization.id,
      },
    });

    if (!project) {
      return new NextResponse('Project not found', { status: 404 });
    }

    // Assign project to team
    const updatedTeam = await prisma.team.update({
      where: {
        id: params.teamId,
      },
      data: {
        projects: {
          connect: {
            id: body.projectId,
          },
        },
      },
      include: {
        projects: true,
      },
    });

    return NextResponse.json(updatedTeam);
  } catch (error) {
    console.error('Error assigning project to team:', error);
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify(error.errors), { status: 400 });
    }
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { teamId: string; projectId: string } }
) {
  try {
    const user = await auth();
    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Check if current user is team admin
    const currentMember = await prisma.teamMember.findFirst({
      where: {
        teamId: params.teamId,
        userId: user.id,
        role: 'ADMIN',
      },
      include: {
        team: {
          include: {
            organization: true,
            projects: true,
          },
        },
      },
    });

    if (!currentMember) {
      return new NextResponse('Forbidden', { status: 403 });
    }

    // Remove project from team
    await prisma.team.update({
      where: {
        id: params.teamId,
      },
      data: {
        projects: {
          disconnect: {
            id: params.projectId,
          },
        },
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error removing project from team:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
