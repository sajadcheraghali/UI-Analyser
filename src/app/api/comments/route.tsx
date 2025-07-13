import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../api/auth/[...nextauth]/route'; // مسیر authOptions را تنظیم کن

let comments: { user: string; text: string }[] = [];

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { text } = await req.json();
  if (!text) {
    return NextResponse.json({ error: 'No comment text' }, { status: 400 });
  }

  comments.push({ user: session.user?.email || 'Anonymous', text });

  return NextResponse.json({ success: true });
}

export async function GET() {
  return NextResponse.json(comments);
}
