import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

const addMemberSchema = z.object({
  email: z.string().email(),
  role: z.enum(['ADMIN', 'MEMBER', 'VIEWER']).default('MEMBER'),
});

const updateMemberSchema = z.object({
  role: z.enum(['ADMIN', 'MEMBER', 'VIEWER']),
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
    const body = addMemberSchema.parse(json);

    // Check if current user is team admin
    const currentMember = await prisma.teamMember.findFirst({
      where: {
        teamId: params.teamId,
        userId: user.id,
        role: 'ADMIN',
      },
    });

    if (!currentMember) {
      return new NextResponse('Forbidden', { status: 403 });
    }

    // Find user by email
    const newUser = await prisma.user.findUnique({
      where: { email: body.email },
    });

    if (!newUser) {
      return new NextResponse('User not found', { status: 404 });
    }

    // Check if user is already a member
    const existingMember = await prisma.teamMember.findUnique({
      where: {
        teamId_userId: {
          teamId: params.teamId,
          userId: newUser.id,
        },
      },
    });

    if (existingMember) {
      return new NextResponse('User is already a team member', { status: 400 });
    }

    // Add user to team
    const teamMember = await prisma.teamMember.create({
      data: {
        teamId: params.teamId,
        userId: newUser.id,
        role: body.role,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            profileImage: true,
          },
        },
      },
    });

    return NextResponse.json(teamMember);
  } catch (error) {
    console.error('Error adding team member:', error);
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify(error.errors), { status: 400 });
    }
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { teamId: string } }
) {
  try {
    const user = await auth();
    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const json = await req.json();
    const { memberId } = json;
    const body = updateMemberSchema.parse(json);

    // Check if current user is team admin
    const currentMember = await prisma.teamMember.findFirst({
      where: {
        teamId: params.teamId,
        userId: user.id,
        role: 'ADMIN',
      },
    });

    if (!currentMember) {
      return new NextResponse('Forbidden', { status: 403 });
    }

    // Update member role
    const updatedMember = await prisma.teamMember.update({
      where: {
        id: memberId,
        teamId: params.teamId,
      },
      data: {
        role: body.role,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            profileImage: true,
          },
        },
      },
    });

    return NextResponse.json(updatedMember);
  } catch (error) {
    console.error('Error updating team member:', error);
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify(error.errors), { status: 400 });
    }
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { teamId: string } }
) {
  try {
    const user = await auth();
    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const memberId = searchParams.get('memberId');

    if (!memberId) {
      return new NextResponse('Member ID is required', { status: 400 });
    }

    // Check if current user is team admin
    const currentMember = await prisma.teamMember.findFirst({
      where: {
        teamId: params.teamId,
        userId: user.id,
        role: 'ADMIN',
      },
    });

    if (!currentMember) {
      return new NextResponse('Forbidden', { status: 403 });
    }

    // Delete team member
    await prisma.teamMember.delete({
      where: {
        id: memberId,
        teamId: params.teamId,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error removing team member:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
