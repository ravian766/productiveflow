import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/session';
import { z } from 'zod';

const projectSchema = z.object({
  name: z.string().min(1, 'Project name is required'),
  description: z.string().optional(),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  status: z.enum(['ACTIVE', 'ON_HOLD', 'COMPLETED']),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!session.user.id || !session.user.orgId) {
      return NextResponse.json(
        { error: 'User or organization not found' },
        { status: 400 }
      );
    }

    const json = await req.json();
    const body = projectSchema.parse(json);

    const project = await db.project.create({
      data: {
        name: body.name,
        description: body.description,
        startDate: new Date(body.startDate),
        endDate: new Date(body.endDate),
        status: body.status,
      //  priority: body.priority,
        users: { 
          connect: { id: session.user.id }
        },
        org: { 
          connect: { id: session.user.orgId }
        },
      },
      include: {
        users: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        tasks: {
          select: {
            id: true,
            status: true
          }
        }
      }
    });

    return NextResponse.json(project);
  } catch (error) {
    console.error('Project creation error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid project data' }, { status: 400 });
    }
    return NextResponse.json(
      { error: 'Failed to create project' },
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

    if (!session.user.orgId) {
      return NextResponse.json(
        { error: 'Organization not found' },
        { status: 400 }
      );
    }

    const projects = await db.project.findMany({
      where: {
        orgId: session.user.orgId
      },
      select: {
        id: true,
        name: true,
        description: true,
        teams: {
          select: {
            id: true
          }
        }
      }
    });

    return NextResponse.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}
