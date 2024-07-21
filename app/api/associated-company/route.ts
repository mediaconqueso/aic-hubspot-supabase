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
    // Get the deal's associated company
    const associatedCompanies = await hubspotClient.crm.deals.associations.v4.get(
      dealId,
      'companies'
    );

    if (associatedCompanies.results.length === 0) {
      return NextResponse.json({ error: 'No associated company found' }, { status: 404 });
    }

    // Get the company details
    const companyId = associatedCompanies.results[0].toObjectId;
    const company = await hubspotClient.crm.companies.basicApi.getById(
      companyId,
      ['name', 'domain', 'industry']
    );

    const companyData = {
      id: company.id,
      name: company.properties.name,
      domain: company.properties.domain,
      industry: company.properties.industry,
    };

    return NextResponse.json(companyData);
  } catch (error) {
    console.error('Error fetching associated company:', error);
    return NextResponse.json({ error: 'Failed to fetch associated company' }, { status: 500 });
  }
}