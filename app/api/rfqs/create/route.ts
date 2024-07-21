import { NextResponse } from 'next/server';
import { createRFQ, createCustomProduct, associateRFQWithDeal, associateCustomProductWithRFQ } from '@/lib/hubspot';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { dealId, ...rfqData } = body;

    // Create RFQ
    const rfq = await createRFQ(rfqData);

    // Associate RFQ with Deal
    await associateRFQWithDeal(rfq.id, dealId);

    // Create Custom Products and associate them with the RFQ
    for (const productData of rfqData.customProducts) {
      const customProduct = await createCustomProduct(productData);
      await associateCustomProductWithRFQ(customProduct.id, rfq.id);
    }

    return NextResponse.json({ success: true, rfq });
  } catch (error) {
    console.error('Error creating RFQ:', error);
    return NextResponse.json({ success: false, error: 'Failed to create RFQ' }, { status: 500 });
  }
}