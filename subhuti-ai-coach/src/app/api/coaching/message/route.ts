import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { sendCoachingMessage } from '@/lib/ai/coach';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    // Get authenticated user
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user from database
    const dbUser = await db.users.findUnique({
      where: { clerkId: user.id },
    });

    if (!dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Parse request
    const { sessionId, message } = await request.json();

    if (!sessionId || !message) {
      return NextResponse.json(
        { error: 'sessionId and message are required' },
        { status: 400 }
      );
    }

    // Send message and get AI response
    const response = await sendCoachingMessage(sessionId, dbUser.id, message);

    return NextResponse.json({
      response: response.response,
      sessionId: response.sessionId,
    });
  } catch (error) {
    console.error('Error sending coaching message:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}
