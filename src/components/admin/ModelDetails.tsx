import React from 'react';

interface Field {
  key: string;
  label: string;
}

interface ModelDetailsProps {
  model: string;
  data: Record<string, any>;
  fields: Field[];
}

const ModelDetails: React.FC<ModelDetailsProps> = ({ model, data, fields }) => {
  return (
    <div className="bg-white shadow-md rounded p-4">
      <h2 className="text-2xl font-bold mb-4">{model.charAt(0).toUpperCase() + model.slice(1)} Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {fields.map((field) => (
          <div key={field.key} className="flex flex-col">
            <span className="font-semibold text-gray-700">{field.label}:</span>
            <span className="text-gray-900">{data[field.key] || 'N/A'}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ModelDetails; 