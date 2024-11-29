import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';

export async function DELETE(
  request: Request,
  { params }: { params: { tagId: string } }
) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // First, verify the tag belongs to the user's organization
    const tag = await prisma.tag.findUnique({
      where: { id: params.tagId },
      select: { orgId: true }
    });

    if (!tag) {
      return NextResponse.json({ error: 'Tag not found' }, { status: 404 });
    }

    if (tag.orgId !== session.user.orgId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Delete the tag
    await prisma.tag.delete({
      where: { id: params.tagId }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting tag:', error);
    return NextResponse.json(
      { error: 'Failed to delete tag' },
      { status: 500 }
    );
  }
}
