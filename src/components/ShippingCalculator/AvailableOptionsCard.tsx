// components/AvailableOptionsCard.tsx
"use client";

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { ShippingEstimate } from "@/lib/utils/shippingCalculator"; // Assuming type is exported

interface AvailableOptionsCardProps {
  estimates: ShippingEstimate[];
  showEstimates: boolean;
  selectedOption?: string;
  onSelect: (estimate: ShippingEstimate) => void;
}

export const AvailableOptionsCard: React.FC<AvailableOptionsCardProps> = ({ estimates, showEstimates, selectedOption, onSelect }) => {
  return (
    <Card className="shadow-xl rounded-2xl bg-white/95 border border-blue-100 mx-1 my-2 p-2 md:p-4 transition-all w-full max-w-full">

      <CardHeader className="mb-2">
        <CardTitle className="text-base text-gray-900">Available Options</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-1 text-black">
        {!showEstimates && (
          <div className="text-center text-gray-500 text-sm py-4">
            <div className="font-semibold mb-1">No calculations yet</div>
            <div>Fill in the shipping details and click <span className="font-semibold text-blue-700">Calculate</span> to see all available shipping options.</div>
          </div>
        )}
        {showEstimates && estimates.length === 0 && (
          <p className="text-sm text-gray-500">No options calculated yet. Please fill the form and click 'Calculate'.</p>
        )}
        {showEstimates && estimates.map(est => (
          <Card
            key={est.option}
            className={`border-2 p-3 mb-1 shadow-md rounded-lg bg-gray-50 cursor-pointer transition-all ${selectedOption === est.option ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-400'}`}
            onClick={() => onSelect(est)}
          >
            <div className="flex flex-col gap-1">
              <span className="font-semibold text-lg text-gray-900">{est.option.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())}</span>
              <span className="text-xl font-bold text-blue-900">₦{est.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              <span className="text-xs text-gray-600">ETA: {est.eta} business days</span>
              <span className="text-xs text-blue-700 underline cursor-pointer">View details</span>
            </div>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
};