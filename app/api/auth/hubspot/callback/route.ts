import { NextResponse } from 'next/server';
import { getAccessToken } from '@/lib/hubspotOAuth';
import { withSessionRoute, SessionData } from '@/lib/session';

async function handler(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.json({ error: 'No code provided' }, { status: 400 });
  }

  try {
    const tokenResponse = await getAccessToken(code);
    
    // Store tokens in the session
    const session = await (req as any).session;
    session.hubspot = {
      accessToken: tokenResponse.accessToken,
      refreshToken: tokenResponse.refreshToken,
      expiresAt: Date.now() + tokenResponse.expiresIn * 1000,
    } as SessionData;
    await session.save();

    // Redirect to the main application page
    return NextResponse.redirect(new URL('/dashboard', req.url));
  } catch (error) {
    console.error('Error getting access token:', error);
    return NextResponse.json({ error: 'Failed to get access token' }, { status: 500 });
  }
}

export const GET = withSessionRoute(handler);