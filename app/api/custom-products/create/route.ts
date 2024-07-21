import { NextResponse } from 'next/server';
import { Client } from '@hubspot/api-client';

const hubspotClient = new Client({ accessToken: process.env.HUBSPOT_ACCESS_TOKEN });

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rfqId = searchParams.get('rfqId');

  if (!rfqId) {
    return NextResponse.json({ error: 'RFQ ID is required' }, { status: 400 });
  }

  try {
    // Get the RFQ's associated custom products
    const associatedProducts = await hubspotClient.crm.objects.associationsApi.getAll(
      'rfq',
      rfqId,
      'custom_product'
    );

    if (associatedProducts.results.length === 0) {
      return NextResponse.json([]);
    }

    // Get details for all associated custom products
    const productsDetails = await Promise.all(
      associatedProducts.results.map(async (association) => {
        const product = await hubspotClient.crm.objects.basicApi.getById(
          'custom_product',
          association.id,
          ['part_description', 'quantity', 'price_per_thousand']
        );
        return {
          id: product.id,
          partDescription: product.properties.part_description,
          quantity: product.properties.quantity,
          pricePerThousand: product.properties.price_per_thousand,
        };
      })
    );

    return NextResponse.json(productsDetails);
  } catch (error) {
    console.error('Error fetching associated custom products:', error);
    return NextResponse.json({ error: 'Failed to fetch associated custom products' }, { status: 500 });
  }
}