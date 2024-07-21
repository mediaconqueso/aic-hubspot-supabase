import { SessionData } from './session';
import { refreshAccessToken } from './hubspotOAuth';

export async function getValidAccessToken(session: { hubspot?: SessionData; save: () => Promise<void> }): Promise<string | null> {
  if (!session.hubspot) {
    return null;
  }

  const { accessToken, refreshToken, expiresAt } = session.hubspot;

  if (!accessToken || !refreshToken) {
    return null;
  }

  // If the token is still valid, return it
  if (expiresAt && expiresAt > Date.now()) {
    return accessToken;
  }

  // Otherwise, refresh the token
  try {
    const newTokens = await refreshAccessToken(refreshToken);
    session.hubspot = {
      accessToken: newTokens.accessToken,
      refreshToken: newTokens.refreshToken,
      expiresAt: Date.now() + newTokens.expiresIn * 1000,
    };
    await session.save();
    return newTokens.accessToken;
  } catch (error) {
    console.error('Error refreshing token:', error);
    return null;
  }
}