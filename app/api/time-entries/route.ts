import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const user = await auth();
    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { taskId, startTime, endTime, description } = await request.json();

    if (!taskId) {
      return new NextResponse('Task ID is required', { status: 400 });
    }

    // Calculate duration if both start and end times are provided
    let duration = null;
    if (startTime && endTime) {
      duration = Math.floor((new Date(endTime).getTime() - new Date(startTime).getTime()) / 1000);
    }

    const timeEntry = await prisma.timeEntry.create({
      data: {
        taskId,
        userId: user.id,
        startTime: startTime ? new Date(startTime) : new Date(),
        endTime: endTime ? new Date(endTime) : null,
        duration,
        description,
      },
      include: {
        task: {
          select: {
            title: true,
            projectId: true,
          },
        },
      },
    });

    // If we have a project ID, update the time entry with it
    if (timeEntry.task.projectId) {
      await prisma.timeEntry.update({
        where: { id: timeEntry.id },
        data: { projectId: timeEntry.task.projectId },
      });
    }

    return NextResponse.json(timeEntry);
  } catch (error) {
    console.error('Time entry creation error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const user = await auth();
    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { id, endTime, description } = await request.json();

    if (!id) {
      return new NextResponse('Time entry ID is required', { status: 400 });
    }

    const timeEntry = await prisma.timeEntry.findUnique({
      where: { id },
      select: { userId: true, startTime: true },
    });

    if (!timeEntry) {
      return new NextResponse('Time entry not found', { status: 404 });
    }

    if (timeEntry.userId !== user.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Calculate duration if end time is provided
    let duration = null;
    if (endTime) {
      duration = Math.floor((new Date(endTime).getTime() - timeEntry.startTime.getTime()) / 1000);
    }

    const updatedTimeEntry = await prisma.timeEntry.update({
      where: { id },
      data: {
        endTime: endTime ? new Date(endTime) : null,
        duration,
        description,
      },
    });

    return NextResponse.json(updatedTimeEntry);
  } catch (error) {
    console.error('Time entry update error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const user = await auth();
    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const taskId = searchParams.get('taskId');
    const status = searchParams.get('status');

    let whereClause: any = {
      userId: user.id,
    };

    if (taskId) {
      whereClause.taskId = taskId;
    }

    if (status === 'in-progress') {
      whereClause.endTime = null;
    }

    const timeEntries = await prisma.timeEntry.findMany({
      where: whereClause,
      orderBy: {
        startTime: 'desc',
      },
      include: {
        task: {
          select: {
            title: true,
            project: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(timeEntries);
  } catch (error) {
    console.error('Time entries fetch error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
