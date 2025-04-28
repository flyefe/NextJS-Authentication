// components/AvailableOptionsCard.tsx
"use client";

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { ShippingEstimate } from "@/lib/utils/shippingCalculator"; // Assuming type is exported

interface AvailableOptionsCardProps {
  estimates: ShippingEstimate[];
  showEstimates: boolean;
}

export const AvailableOptionsCard: React.FC<AvailableOptionsCardProps> = ({ estimates, showEstimates }) => {
  return (
    <Card className=" shadow-md rounded-lg bg-white border border-gray-200 mx-2 my-2">
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
            className="border-2 border-gray-200 p-3 mb-1 shadow-md rounded-lg bg-gray-50"
            // Add onClick handler here if needed in the future to select an option
          >
            <div className="flex flex-col gap-1">
              <span className="font-semibold text-lg text-gray-900">{est.option.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())}</span>
              <span className="text-l font-bold text-blue-900">₦{est.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              <span className="text-xs text-gray-600">ETA: {est.eta} business days</span>
              <span className="text-xs text-blue-700 underline cursor-pointer">View details</span> {/* Placeholder */}
            </div>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
};