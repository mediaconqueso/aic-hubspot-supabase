'use client'

import { useState, useEffect } from 'react'
import RFQForm from './RFQForm'

interface Deal {
  id: string
  properties: {
    dealname: string
    amount: string
    closedate: string
    dealstage: string
  }
}

export default function DealsList() {
  const [deals, setDeals] = useState<Deal[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchDeals() {
      try {
        const response = await fetch('/api/deals')
        if (!response.ok) {
          throw new Error('Failed to fetch deals')
        }
        const data = await response.json()
        setDeals(data)
      } catch (err) {
        setError('Error fetching deals')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchDeals()
  }, [])

  const handleCreateRFQ = async (formData: any) => {
    try {
      const response = await fetch('/api/rfqs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to create RFQ');
      }

      const result = await response.json();
      console.log('RFQ created:', result);
      // Optionally, refresh the deals list or show a success message
    } catch (error) {
      console.error('Error creating RFQ:', error);
      // Show an error message to the user
    }
  };

  if (loading) return <div className="text-center py-4">Loading deals...</div>;
  if (error) return <div className="text-center py-4 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold mb-8">HubSpot Dashboard</h1>
      
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Create RFQ</h2>
        <RFQForm 
  deal={selectedDeal} 
  onSubmit={handleRFQSubmit} 
  onCancel={() => setSelectedDeal(null)}
/>
      </div>

      <h2 className="text-2xl font-bold mb-4">Open Deals</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {deals.map((deal) => (
          <div key={deal.id} className="bg-white shadow-md rounded-lg p-4">
            <h3 className="text-xl font-semibold mb-2">{deal.properties.dealname}</h3>
            <p className="mb-1"><span className="font-medium">Amount:</span> ${deal.properties.amount}</p>
            <p className="mb-1"><span className="font-medium">Close Date:</span> {deal.properties.closedate}</p>
            <p className="mb-3"><span className="font-medium">Stage:</span> {deal.properties.dealstage}</p>
          </div>
        ))}
      </div>
    </div>
  );
}