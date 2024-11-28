import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    
    // Generate reset token
    const resetToken = randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

    await prisma.user.update({
      where: { email },
      data: {
        resetToken,
        resetTokenExpiry,
      } as any,
    });

    // Here you would typically send an email with the reset link
    // For now, we'll just return the token
    return NextResponse.json({ resetToken });

  } catch (error) {
    console.error('Password reset error:', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}