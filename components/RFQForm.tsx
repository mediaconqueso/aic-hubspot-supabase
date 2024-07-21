'use client'

import React, { useState, useEffect } from 'react';
import { Deal, RFQ, CustomPart, AssociatedContact } from '@/app/types';

interface RFQFormProps {
  deal: Deal;
  onSubmit: (formData: RFQ) => void;
  onCancel: () => void;
}

export default function RFQForm({ deal, onSubmit, onCancel }: RFQFormProps) {
  const [rfqData, setRfqData] = useState<RFQ>({
    dealId: deal.id,
    dealName: deal.properties.dealname,
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    salesperson: '',
    accountNumber: '',
    manager: '',
    rfqDate: '',
    quoteDate: '',
    customParts: [],
  });

  const [newPart, setNewPart] = useState<CustomPart>({
    quantity: 0,
    customerPartNumber: '',
    abbottPartNumber: '',
    partDescription: '',
    pricePerThousand: 0,
    estimatedAnnualUsage: 0,
    specialRequirements: '',
    previousPurchaseOrderDate: '',
    supplier: '',
    costQuantityTargetPrice: 0,
    isNewPart: true,
  });

  useEffect(() => {
    fetchAssociatedContact();
  }, [deal.id]);

  const fetchAssociatedContact = async () => {
    try {
      const response = await fetch(`/api/associated-contact?dealId=${deal.id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const contact: AssociatedContact = await response.json();
      setRfqData(prev => ({
        ...prev,
        customerName: contact.name,
        customerPhone: contact.phone,
        customerEmail: contact.email,
      }));
    } catch (error) {
      console.error('Error fetching associated contact:', error);
    }
  };

  const handleRfqChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRfqData(prev => ({ ...prev, [name]: value }));
  };

  const handlePartChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setNewPart(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }));
  };

  const addPart = (isNewPart: boolean) => {
    setRfqData(prev => ({
      ...prev,
      customParts: [...prev.customParts, { ...newPart, isNewPart }],
    }));
    setNewPart({
      quantity: 0,
      customerPartNumber: '',
      abbottPartNumber: '',
      partDescription: '',
      pricePerThousand: 0,
      estimatedAnnualUsage: 0,
      specialRequirements: '',
      previousPurchaseOrderDate: '',
      supplier: '',
      costQuantityTargetPrice: 0,
      isNewPart: true,
    });
  };

  const removePart = (index: number) => {
    setRfqData(prev => ({
      ...prev,
      customParts: prev.customParts.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(rfqData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">RFQ Form</h2>
      
      {/* RFQ Details */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="dealId" className="block text-sm font-medium text-gray-700">Deal ID</label>
          <input
            type="text"
            id="dealId"
            name="dealId"
            value={rfqData.dealId}
            readOnly
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 bg-gray-100"
          />
        </div>
        <div>
          <label htmlFor="salesperson" className="block text-sm font-medium text-gray-700">Salesperson</label>
          <input
            type="text"
            id="salesperson"
            name="salesperson"
            value={rfqData.salesperson}
            onChange={handleRfqChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        <div>
          <label htmlFor="dealName" className="block text-sm font-medium text-gray-700">Deal Name</label>
          <input
            type="text"
            id="dealName"
            name="dealName"
            value={rfqData.dealName}
            onChange={handleRfqChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        <div>
          <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-700">Account Number</label>
          <input
            type="text"
            id="accountNumber"
            name="accountNumber"
            value={rfqData.accountNumber}
            onChange={handleRfqChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        <div>
          <label htmlFor="customerName" className="block text-sm font-medium text-gray-700">Customer Name</label>
          <input
            type="text"
            id="customerName"
            name="customerName"
            value={rfqData.customerName}
            onChange={handleRfqChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        <div>
          <label htmlFor="manager" className="block text-sm font-medium text-gray-700">Manager</label>
          <input
            type="text"
            id="manager"
            name="manager"
            value={rfqData.manager}
            onChange={handleRfqChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        <div>
          <label htmlFor="customerPhone" className="block text-sm font-medium text-gray-700">Customer Phone</label>
          <input
            type="tel"
            id="customerPhone"
            name="customerPhone"
            value={rfqData.customerPhone}
            onChange={handleRfqChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        <div>
          <label htmlFor="rfqDate" className="block text-sm font-medium text-gray-700">RFQ Date</label>
          <input
            type="date"
            id="rfqDate"
            name="rfqDate"
            value={rfqData.rfqDate}
            onChange={handleRfqChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        <div>
          <label htmlFor="customerEmail" className="block text-sm font-medium text-gray-700">Customer Email</label>
          <input
            type="email"
            id="customerEmail"
            name="customerEmail"
            value={rfqData.customerEmail}
            onChange={handleRfqChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        <div>
          <label htmlFor="quoteDate" className="block text-sm font-medium text-gray-700">Quote Date</label>
          <input
            type="date"
            id="quoteDate"
            name="quoteDate"
            value={rfqData.quoteDate}
            onChange={handleRfqChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
      </div>

      {/* Custom Parts List */}
      <h3 className="text-xl font-bold mt-6 mb-4">Custom Parts</h3>
      {rfqData.customParts.map((part, index) => (
        <div key={index} className="border p-4 rounded mb-4 bg-gray-50">
          <h4 className="font-semibold mb-2">{part.isNewPart ? 'New Part' : 'Reorder Part'} {index + 1}</h4>
          <div className="grid grid-cols-2 gap-2">
            <p><strong>Customer Part Number:</strong> {part.customerPartNumber}</p>
            <p><strong>Abbott Part Number:</strong> {part.abbottPartNumber}</p>
            <p><strong>Previous PO Date:</strong> {part.previousPurchaseOrderDate}</p>
            <p><strong>Supplier:</strong> {part.supplier}</p>
          </div>
          <button
            type="button"
            onClick={() => removePart(index)}
            className="mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
          >
            Remove Part
          </button>
        </div>
      ))}

      {/* Add New Part Form */}
      <div className="border p-4 rounded bg-gray-50">
        <h4 className="font-semibold mb-2">Add New Part</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="customerPartNumber" className="block text-sm font-medium text-gray-700">Customer Part Number</label>
            <input
              type="text"
              id="customerPartNumber"
              name="customerPartNumber"
              value={newPart.customerPartNumber}
              onChange={handlePartChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          <div>
            <label htmlFor="abbottPartNumber" className="block text-sm font-medium text-gray-700">Abbott Part Number</label>
            <input
              type="text"
              id="abbottPartNumber"
              name="abbottPartNumber"
              value={newPart.abbottPartNumber}
              onChange={handlePartChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          <div>
            <label htmlFor="previousPurchaseOrderDate" className="block text-sm font-medium text-gray-700">Previous PO Date</label>
            <input
              type="date"
              id="previousPurchaseOrderDate"
              name="previousPurchaseOrderDate"
              value={newPart.previousPurchaseOrderDate}
              onChange={handlePartChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          <div>
            <label htmlFor="supplier" className="block text-sm font-medium text-gray-700">Supplier</label>
            <input
              type="text"
              id="supplier"
              name="supplier"
              value={newPart.supplier}
              onChange={handlePartChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
        </div>
        <div className="mt-4 space-x-4">
          <button
            type="button"
            onClick={() => addPart(true)}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
          >
            Add as New Part
          </button>
          <button
            type="button"
            onClick={() => addPart(false)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            Add as Reorder Part
          </button>
        </div>
      </div>

      {/* Form Submission Buttons */}
      <div className="flex justify-end space-x-4 mt-6">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Submit RFQ
        </button>
      </div>
    </form>
  );
}