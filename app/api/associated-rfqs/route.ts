import { NextResponse } from 'next/server';
import { Client } from '@hubspot/api-client';

const hubspotClient = new Client({ accessToken: process.env.HUBSPOT_ACCESS_TOKEN });

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const dealId = searchParams.get('dealId');

  if (!dealId) {
    return NextResponse.json({ error: 'Deal ID is required' }, { status: 400 });
  }

  try {
    // Get the deal's associated RFQs
    const associatedRFQs = await hubspotClient.crm.deals.associations.v4.get(dealId, 'contacts');

    if (associatedRFQs.results.length === 0) {
      return NextResponse.json([]);
    }

    // Get details for all associated RFQs
    const rfqsDetails = await Promise.all(
      associatedRFQs.results.map(async (association) => {
        const rfq = await hubspotClient.crm.objects.basicApi.getById(
          'rfq',
          association.id,
          ['rfq_number', 'quote_date', 'vendor_name']
        );
        return {
          id: rfq.id,
          rfqNumber: rfq.properties.rfq_number,
          quoteDate: rfq.properties.quote_date,
          vendorName: rfq.properties.vendor_name,
        };
      })
    );

    return NextResponse.json(rfqsDetails);
  } catch (error) {
    console.error('Error fetching associated RFQs:', error);
    return NextResponse.json({ error: 'Failed to fetch associated RFQs' }, { status: 500 });
  }
}