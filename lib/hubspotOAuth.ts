import { Client } from '@hubspot/api-client';

export const SCOPES = [
  'crm.objects.deals.read',
  'crm.objects.deals.write',
  'crm.objects.contacts.read',
  'crm.objects.custom.read',
  'crm.objects.custom.write',
  'crm.schemas.custom.read'
];

export const hubspotClient = new Client();

export const getAuthorizationUrl = () => {
  return hubspotClient.oauth.getAuthorizationUrl(
    process.env.HUBSPOT_CLIENT_ID!,
    process.env.HUBSPOT_REDIRECT_URI!,
    SCOPES
  );
};

export const getAccessToken = async (code: string) => {
  return await hubspotClient.oauth.tokensApi.createToken(
    'authorization_code',
    code,
    process.env.HUBSPOT_REDIRECT_URI!,
    process.env.HUBSPOT_CLIENT_ID!,
    process.env.HUBSPOT_CLIENT_SECRET!
  );
};

export const refreshAccessToken = async (refreshToken: string) => {
  return await hubspotClient.oauth.tokensApi.createToken(
    'refresh_token',
    undefined,
    undefined,
    process.env.HUBSPOT_CLIENT_ID!,
    process.env.HUBSPOT_CLIENT_SECRET!,
    refreshToken
  );
};