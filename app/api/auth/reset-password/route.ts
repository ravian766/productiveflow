import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    
    // Generate reset token
    const resetToken = randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

    await db.user.update({
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