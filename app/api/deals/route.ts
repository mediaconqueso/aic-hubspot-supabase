import { NextResponse } from 'next/server';
import { hubspotClient } from '@/lib/hubspotOAuth';
import { withSessionRoute } from '@/lib/session';
import { getValidAccessToken } from '@/lib/tokenUtils';

async function handler(req: Request) {
  const session = await (req as any).session;
  const accessToken = await getValidAccessToken(session);

  if (!accessToken) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    hubspotClient.setAccessToken(accessToken);
    const apiResponse = await hubspotClient.crm.deals.basicApi.getPage(100);
    return NextResponse.json(apiResponse);
  } catch (error) {
    console.error('Error fetching deals:', error);
    return NextResponse.json({ error: 'Failed to fetch deals' }, { status: 500 });
  }
}

export const GET = withSessionRoute(handler);