'use client'

import React, { useState } from 'react';

export default function TestHubSpot() {
  const [result, setResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const testHubSpotConnection = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/test-hubspot');
      const text = await response.text();
      try {
        const data = JSON.parse(text);
        setResult(JSON.stringify(data, null, 2));
      } catch (parseError) {
        setResult(`Failed to parse JSON. Raw response:\n\n${text}`);
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      setResult(`Error: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2>Test HubSpot Connection</h2>
      <button 
        onClick={testHubSpotConnection}
        disabled={isLoading}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        {isLoading ? 'Testing...' : 'Test Connection'}
      </button>
      {result && (
        <pre className="mt-4 p-4 bg-gray-100 rounded overflow-auto">
          {result}
        </pre>
      )}
    </div>
  );
}