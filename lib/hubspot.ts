import { Client } from '@hubspot/api-client';
import { AssociationSpecAssociationCategoryEnum } from '@hubspot/api-client/lib/codegen/crm/associations/v4/models/AssociationSpec';

const hubspotClient = new Client({ accessToken: process.env.HUBSPOT_ACCESS_TOKEN });

export async function createDeal(dealData: Record<string, any>) {
  return await hubspotClient.crm.deals.basicApi.create({ properties: dealData, associations: [] });
}

export async function createRFQ(rfqData: Record<string, any>) {
  return await hubspotClient.crm.objects.basicApi.create('2-8709853', { properties: rfqData, associations: [] });
}

export async function createCustomProduct(productData: Record<string, any>) {
  return await hubspotClient.crm.objects.basicApi.create('2-8709854', { properties: productData, associations: [] });
}

export async function associateRFQWithDeal(rfqId: string, dealId: string) {
  return await hubspotClient.crm.associations.v4.basicApi.create(
    'deals',
    dealId,
    '2-8709853',
    rfqId,
    [{ associationCategory: AssociationSpecAssociationCategoryEnum.HubspotDefined, associationTypeId: 1 }]
  );
}

export async function associateCustomProductWithRFQ(productId: string, rfqId: string) {
  return await hubspotClient.crm.associations.v4.basicApi.create(
    '2-8709853',
    rfqId,
    '2-8709854',
    productId,
    [{ associationCategory: AssociationSpecAssociationCategoryEnum.HubspotDefined, associationTypeId: 1 }]
  );
}

export async function getAssociations(objectId: string, fromObjectType: string, toObjectType: string) {
  return await hubspotClient.crm.associations.v4.basicApi.getPage(
    fromObjectType,
    objectId,
    toObjectType
  );
}


export async function getOpenDeals() {
  try {
    const filter = {
      propertyName: 'dealstage',
      operator: 'NEQ',
      value: 'closedwon'
    };
    const properties = ['dealname', 'amount', 'closedate', 'dealstage'];
    const sorts = [{ propertyName: 'createdate', direction: 'DESCENDING' }];
    const limit = 100;
    const after = 0;

    const searchRequest = {
      filterGroups: [{ filters: [filter] }],
      sorts,
      properties,
      limit,
      after
    };

    console.log('Search request:', JSON.stringify(searchRequest, null, 2));

    const result = await hubspotClient.crm.deals.searchApi.doSearch(searchRequest);
    console.log('Fetched deals:', result);
    return result;
  } catch (error: unknown) {
    console.error('Error in getOpenDeals:', error);
    if (error instanceof Error && 'response' in error) {
      const apiError = error as any;
      console.error('Response data:', apiError.response?.data);
      console.error('Response status:', apiError.response?.status);
    }
    throw error;
  }
}
export async function getCustomProductsForRFQ(rfqId: string) {
  return await hubspotClient.crm.associations.v4.basicApi.getPage('2-8709853', rfqId, '2-8709854');
}