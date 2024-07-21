'use client'

import React, { useState } from 'react';

interface ApiResponse {
  endpoint: string;
  payload: any;
  response: any;
  error?: string;
}

export default function TestApiPage() {
  const [dealId, setDealId] = useState('');
  const [responses, setResponses] = useState<ApiResponse[]>([]);

  const testEndpoint = async (endpoint: string) => {
    try {
      const response = await fetch(`/api/${endpoint}?dealId=${dealId}`);
      const data = await response.json();
      setResponses(prev => [{
        endpoint,
        payload: { dealId },
        response: data
      }, ...prev]);
    } catch (error) {
      setResponses(prev => [{
        endpoint,
        payload: { dealId },
        error: error instanceof Error ? error.message : String(error)
      }, ...prev]);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">API Test Page</h1>
      <div className="mb-4">
        <label htmlFor="dealId" className="block mb-2">Deal ID:</label>
        <input
          type="text"
          id="dealId"
          value={dealId}
          onChange={(e) => setDealId(e.target.value)}
          className="border p-2 w-full"
        />
      </div>
      <div className="grid grid-cols-2 gap-4 mb-8">
        <button onClick={() => testEndpoint('associated-contact')} className="bg-blue-500 text-white p-2 rounded">
          Test Associated Contacts
        </button>
        <button onClick={() => testEndpoint('associated-company')} className="bg-green-500 text-white p-2 rounded">
          Test Associated Company
        </button>
        <button onClick={() => testEndpoint('associated-rfqs')} className="bg-yellow-500 text-white p-2 rounded">
          Test Associated RFQs
        </button>
        <button onClick={() => testEndpoint('associated-custom-products')} className="bg-purple-500 text-white p-2 rounded">
          Test Associated Custom Products
        </button>
      </div>
      <div>
        <h2 className="text-xl font-bold mb-4">API Responses</h2>
        {responses.map((response, index) => (
          <div key={index} className="mb-4 p-4 bg-gray-100 rounded">
            <h3 className="font-bold">{response.endpoint}</h3>
            <p className="font-medium mt-2">Payload:</p>
            <pre className="text-sm">{JSON.stringify(response.payload, null, 2)}</pre>
            <p className="font-medium mt-2">Response:</p>
            <pre className="text-sm">{JSON.stringify(response.response, null, 2)}</pre>
            {response.error && (
              <>
                <p className="font-medium mt-2 text-red-500">Error:</p>
                <pre className="text-sm text-red-500">{response.error}</pre>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}