import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { z } from 'zod';

const themeSchema = z.object({
  theme: z.enum(['system', 'light', 'dark']),
  accentColor: z.enum(['blue', 'green', 'purple', 'red', 'orange']),
});

export async function GET() {
  try {
    const user = await auth();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const settings = await db.user.findUnique({
      where: { id: user.id },
      select: {
        theme: true,
        accentColor: true,
      },
    });

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Theme settings fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch theme settings' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await auth();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const validatedData = themeSchema.parse(body);

    const updatedUser = await db.user.update({
      where: { id: user.id },
      data: {
        theme: validatedData.theme,
        accentColor: validatedData.accentColor,
      },
      select: {
        theme: true,
        accentColor: true,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Theme settings update error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid theme settings', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to update theme settings' },
      { status: 500 }
    );
  }
}
