import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { startCoachingSession, runDailyCheckin } from '@/lib/ai/coach';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    // Get authenticated user
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get or create user in database
    let dbUser = await db.users.findUnique({
      where: { clerkId: user.id },
    });

    if (!dbUser) {
      dbUser = await db.users.create({
        data: {
          clerkId: user.id,
          email: user.emailAddresses[0].emailAddress,
          fullName: user.fullName || undefined,
        },
      });
    }

    // Parse request
    const { mood, stress, sessionType = 'daily_checkin' } = await request.json();

    // Start coaching session
    const { sessionId } = await startCoachingSession(dbUser.id, sessionType);

    // Save mood/stress to session
    await db.coachingSessions.update({
      where: { id: sessionId },
      data: {
        moodBefore: mood,
        // stress will be saved in user message
      },
    });

    // Run daily check-in flow
    const checkinResponse = await runDailyCheckin(dbUser.id);

    return NextResponse.json({
      sessionId,
      message: checkinResponse.response,
    });
  } catch (error) {
    console.error('Error starting coaching session:', error);
    return NextResponse.json(
      { error: 'Failed to start session' },
      { status: 500 }
    );
  }
}
