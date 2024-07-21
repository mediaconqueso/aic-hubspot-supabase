import { NextResponse } from 'next/server';
import { Client } from '@hubspot/api-client';

export async function GET() {
  console.log('Test HubSpot API route called');
  console.log('HUBSPOT_ACCESS_TOKEN:', process.env.HUBSPOT_ACCESS_TOKEN ? 'Set' : 'Not set');

  if (!process.env.HUBSPOT_ACCESS_TOKEN) {
    return NextResponse.json({
      success: false,
      message: 'HUBSPOT_ACCESS_TOKEN is not set in environment variables',
    }, { status: 500 });
  }

  const hubspotClient = new Client({ accessToken: process.env.HUBSPOT_ACCESS_TOKEN });

  try {
    console.log('Attempting to fetch deals from HubSpot');
    const apiResponse = await hubspotClient.crm.deals.basicApi.getPage(1);

    console.log('HubSpot API Response:', apiResponse);

    return NextResponse.json({
      success: true,
      message: 'Successfully connected to HubSpot API',
      data: apiResponse
    });
  } catch (error: unknown) {
    console.error('Error connecting to HubSpot:', error);

    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    const errorDetails = error instanceof Error && 'response' in error ? (error as any).response?.data : null;

    return NextResponse.json({
      success: false,
      message: 'Failed to connect to HubSpot API',
      error: errorMessage,
      details: errorDetails,
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}