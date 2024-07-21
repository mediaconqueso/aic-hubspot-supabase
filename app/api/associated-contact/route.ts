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
    // Get the deal's associated contacts
    const associatedContacts = await hubspotClient.crm.deals.associations.v4.get(dealId, 'contacts');

    if (associatedContacts.results.length === 0) {
      return NextResponse.json({ error: 'No associated contacts found' }, { status: 404 });
    }

    // Get details for all associated contacts
    const contactsDetails = await Promise.all(
      associatedContacts.results.map(async (association) => {
        const contact = await hubspotClient.crm.contacts.basicApi.getById(
          association.id,
          ['firstname', 'lastname', 'phone', 'email']
        );
        return {
          id: contact.id,
          name: `${contact.properties.firstname} ${contact.properties.lastname}`,
          phone: contact.properties.phone,
          email: contact.properties.email,
        };
      })
    );

    return NextResponse.json(contactsDetails);
  } catch (error) {
    console.error('Error fetching associated contacts:', error);
    return NextResponse.json({ error: 'Failed to fetch associated contacts' }, { status: 500 });
  }
}