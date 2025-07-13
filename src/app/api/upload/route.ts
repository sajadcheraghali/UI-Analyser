import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises'; // ✅ اطمینان از ایمپورت mkdir
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;

    if (!file) {
      return NextResponse.json({ success: false, message: 'فایلی دریافت نشد' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    const filename = `${Date.now()}-${file.name}`;
    const filePath = path.join(uploadDir, filename);

    // ✅ فولدر رو بساز اگر وجود نداره
    await mkdir(uploadDir, { recursive: true });

    // ✅ ذخیره فایل
    await writeFile(filePath, buffer);

    const imageUrl = `/uploads/${filename}`;
    return NextResponse.json({ success: true, imageUrl }, { status: 200 });

  } catch (error) {
    console.error('خطا در آپلود فایل:', error);
    return NextResponse.json(
      { success: false, message: 'خطا در آپلود فایل' },
      { status: 500 }
    );
  }
}
