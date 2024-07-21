'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Deal, RFQ, CustomProduct, ApiLog } from '@/app/types';
import RFQForm from './RFQForm';
import AssociatedDataDisplay from './AssociatedDataDisplay';

interface ApiLog {
  timestamp: string;
  endpoint: string;
  payload?: any;
  response?: any;
  error?: string;
}

export default function DealsList() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [apiLogs, setApiLogs] = useState<ApiLog[]>([]);
  const [associatedData, setAssociatedData] = useState<{
    contacts: any[];
    rfqs: RFQ[];
    customProducts: { [rfqId: string]: CustomProduct[] };
  } | null>(null);

  const router = useRouter();

  useEffect(() => {
    fetchDeals();
  }, []);

  const fetchDeals = async () => {
    try {
      const response = await fetch('/api/deals');
      if (response.status === 401) {
        // Redirect to authentication if not authenticated
        router.push('/api/auth/hubspot');
        return;
      }
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setDeals(data.results || []);
      logApiCall('GET', '/api/deals', undefined, data);
    } catch (err) {
      console.error('Error fetching deals:', err);
      setError('Error fetching deals: ' + (err instanceof Error ? err.message : String(err)));
      logApiCall('GET', '/api/deals', undefined, undefined, err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRFQ = async (deal: Deal) => {
    setSelectedDeal(deal);
    logApiCall('Creating RFQ for deal', { dealId: deal.id, dealName: deal.properties.dealname });
    await fetchAssociatedData(deal.id);
  };

  const fetchAssociatedData = async (dealId: string) => {
    const newAssociatedData: {
      contacts: any[];
      rfqs: RFQ[];
      customProducts: { [rfqId: string]: CustomProduct[] };
    } = {
      contacts: [],
      rfqs: [],
      customProducts: {},
    };
  
    try {
      // Fetch associated contacts
      const contactsResponse = await fetch(`/api/associated-contact?dealId=${dealId}`);
      newAssociatedData.contacts = await contactsResponse.json();
      logApiCall('GET /api/associated-contact', { dealId }, newAssociatedData.contacts);
  
      // Fetch associated RFQs
      const rfqsResponse = await fetch(`/api/associated-rfqs?dealId=${dealId}`);
      newAssociatedData.rfqs = await rfqsResponse.json();
      logApiCall('GET /api/associated-rfqs', { dealId }, newAssociatedData.rfqs);
  
      // Fetch custom products for each RFQ
      for (const rfq of newAssociatedData.rfqs) {
        const customProductsResponse = await fetch(`/api/associated-custom-products?rfqId=${rfq.id}`);
        newAssociatedData.customProducts[rfq.id] = await customProductsResponse.json();
        logApiCall('GET /api/associated-custom-products', { rfqId: rfq.id }, newAssociatedData.customProducts[rfq.id]);
      }
  
      setAssociatedData(newAssociatedData);
    } catch (error) {
      console.error('Error fetching associated data:', error);
      logApiCall('Error fetching associated data', { dealId }, null, error instanceof Error ? error.message : String(error));
    }
  };

  const handleRFQSubmit = async (formData: any) => {
    try {
      logApiCall('Submitting RFQ', formData);
      const response = await fetch('/api/rfqs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      logApiCall('RFQ created', data);
      setSelectedDeal(null);
    } catch (err) {
      console.error('Error creating RFQ:', err);
      logApiCall('Error creating RFQ', err);
    }
  };

  const logApiCall = (message: string, data: any) => {
    const logEntry = `${new Date().toISOString()} - ${message}:\n${JSON.stringify(data, null, 2)}`;
    setApiLogs(prev => [logEntry, ...prev]);
  };

  if (loading) return <div className="text-center py-4">Loading deals...</div>;
  if (error) return <div className="text-center py-4 text-red-500">Error: {error}</div>;

  return (
    <div className="flex">
      <div className="w-2/3 pr-4">
        {selectedDeal && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Create RFQ for {selectedDeal.properties.dealname}</h2>
            <RFQForm deal={selectedDeal} onSubmit={handleRFQSubmit} onCancel={() => setSelectedDeal(null)} />
          </div>
        )}
        <h2 className="text-2xl font-bold mb-4">Open Deals</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {deals.map((deal) => (
            <div key={deal.id} className="bg-white shadow-md rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-2">{deal.properties.dealname}</h3>
              <p className="mb-1"><span className="font-medium">Deal ID:</span> {deal.id}</p>
              <p className="mb-1"><span className="font-medium">Amount:</span> ${deal.properties.amount}</p>
              <p className="mb-1"><span className="font-medium">Close Date:</span> {deal.properties.closedate}</p>
              <p className="mb-3"><span className="font-medium">Stage:</span> {deal.properties.dealstage}</p>
              <button
                onClick={() => handleCreateRFQ(deal)}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
              >
                Create RFQ
              </button>
            </div>
          ))}
        </div>
      </div>
      
      <div className="w-1/3 pl-4 border-l">
        <h3 className="text-xl font-bold mb-4">Associated Data</h3>
        <AssociatedDataDisplay data={associatedData} />
        <h3 className="text-xl font-bold mt-8 mb-4">API Logs</h3>
        <div className="bg-gray-100 p-4 rounded-lg overflow-auto h-[calc(100vh-400px)]">
          {apiLogs.map((log, index) => (
            <pre key={index} className="text-sm mb-2 whitespace-pre-wrap break-words bg-white p-2 rounded shadow">
              {log}
            </pre>
          ))}
        </div>
      </div>
    </div>
  );
}