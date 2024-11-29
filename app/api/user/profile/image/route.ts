import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { join } from 'path';
import { writeFile, mkdir } from 'fs/promises';

// Configure Next.js to handle file uploads
export async function POST(request: Request) {
  try {
    const user = await auth();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
      // Parse the multipart form data
      const data = await request.formData();
      const file = data.get('image') as File;
      
      if (!file) {
        return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
      }

      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        return NextResponse.json({ error: 'Invalid file type' }, { status: 400 });
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        return NextResponse.json({ error: 'File too large' }, { status: 400 });
      }

      // Create unique filename
      const timestamp = Date.now();
      const extension = file.name.split('.').pop();
      const filename = `${user.id}-${timestamp}.${extension}`;
      
      // Ensure upload directory exists
      const uploadDir = join(process.cwd(), 'public', 'uploads');
      await mkdir(uploadDir, { recursive: true });
      
      const filepath = join(uploadDir, filename);

      // Convert File to Buffer and write to disk
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      console.log('Writing file to:', filepath);
      await writeFile(filepath, buffer);
      console.log('File written successfully');

      // Update user profile with image URL
      const imageUrl = `/uploads/${filename}`;
      await db.user.update({
        where: { id: user.id },
        data: { profileImage: imageUrl },
      });

      return NextResponse.json({ imageUrl });
    } catch (error) {
      console.error('Error processing upload:', error);
      return NextResponse.json(
        { error: 'Error processing file upload' },
        { status: 500 }
      );
    }
  } catch (authError) {
    console.error('Auth error:', authError);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 401 }
    );
  }
}
