import React from 'react';

interface AssociatedDataDisplayProps {
  data: Record<string, unknown> | null;
}

const AssociatedDataDisplay: React.FC<AssociatedDataDisplayProps> = ({ data }) => {
  if (!data) {
    return <div>No associated data available.</div>;
  }

  return (
    <div className="space-y-4">
      {Object.entries(data).map(([key, value]) => (
        <div key={key} className="bg-white p-4 rounded-lg shadow">
          <h4 className="text-lg font-semibold mb-2">{key}</h4>
          {typeof value === 'object' && value !== null && 'error' in value ? (
            <p className="text-red-500">{String(value.error)}</p>
          ) : (
            <pre className="text-sm whitespace-pre-wrap break-words">
              {JSON.stringify(value, null, 2)}
            </pre>
          )}
        </div>
      ))}
    </div>
  );
};

export default AssociatedDataDisplay;