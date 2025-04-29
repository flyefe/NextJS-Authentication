// components/DetailsCard.tsx
"use client";

import React from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { ShippingEstimate } from "@/lib/utils/shippingCalculator"; // Assuming type is exported
import { useUser } from '@/hooks/useUser';

interface DetailsCardProps {
  selectedEstimate: ShippingEstimate | undefined;
}

export const DetailsCard: React.FC<DetailsCardProps> = ({ selectedEstimate }) => {
  const { user } = useUser();
  return (
    <Card className="p-3 md:p-6 shadow-xl rounded-2xl bg-white/95 border border-blue-100 mx-1 my-2 transition-all w-full max-w-full">

      <CardHeader>
        <CardTitle className="text-base text-blue-900 flex items-center gap-2 w-full">
          {/* Using a placeholder icon, replace if you have a specific one */}
          <span className="text-gray-900">$</span>
          <span className="text-gray-900 break-words truncate w-full block">
             {selectedEstimate ? `₦${selectedEstimate.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '--'}
           </span>
        </CardTitle>
        <div className="text-gray-900 text-xs">
          Estimated Time of Arrival: {selectedEstimate ? `${selectedEstimate.eta} business days` : '--'}
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="font-semibold mb-2 text-gray-900">Calculation Summary</div>
          <div className="text-xs text-gray-700 bg-gray-50 p-2 rounded">
            {selectedEstimate ? (
              user ? (
                <div>
                  <div className="font-semibold text-gray-900 mb-1">Breakdown</div>
                  {selectedEstimate.calculationDetails ? (
                    <>
                      <div className="bg-gray-100 p-2 rounded text-xs mb-2">
                        <pre className="whitespace-pre-wrap break-words text-xs">{selectedEstimate.calculationDetails}</pre>
                      </div>
                    </>
                  ) : (
                    <ul className="list-disc ml-4 text-xs text-gray-800">
                      <li><span className="font-medium">Option:</span> {selectedEstimate.option.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())}</li>
                      <li><span className="font-medium">Amount:</span> ₦{selectedEstimate.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</li>
                      <li><span className="font-medium">ETA:</span> {selectedEstimate.eta} business days</li>
                      {selectedEstimate.notes && <li><span className="font-medium">Notes:</span> {selectedEstimate.notes}</li>}
                    </ul>
                  )}
                </div>
              ) : (
                <div className="bg-blue-50 border border-blue-400 rounded-lg p-4 flex flex-col items-center text-center my-2">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m0 0a2 2 0 01-2-2h4a2 2 0 01-2 2zm6-6V7a6 6 0 10-12 0v2a6 6 0 0012 0z" /></svg>
                    <span className="font-bold text-blue-900 text-base">Log in or Register to See Full Breakdown</span>
                  </div>
                  <div className="text-blue-900 text-xs mb-3">Sign in or create an account to view detailed calculation breakdowns for this shipping option.</div>
                  <div className="flex gap-3">
                    <Link href="/login" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1.5 px-4 rounded shadow transition-colors">Sign In</Link>
                    <Link href="/signup" className="bg-white border border-blue-600 text-blue-700 hover:bg-blue-50 font-semibold py-1.5 px-4 rounded shadow transition-colors">Register</Link>
                  </div>
                </div>
              )
            ) : (
              "Select parameters and click 'Calculate' to see details."
            )}
          </div>
        </div>
        <button
            className="w-full bg-blue-700 rounded px-4 py-2 font-semibold mb-2 hover:bg-blue-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!selectedEstimate}
        >
          <Link href="/">Proceed with this option</Link>
        </button>
        <button
            className="w-full border border-blue-700 text-black rounded px-4 py-2 font-semibold hover:bg-blue-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!selectedEstimate}
        >
          <Link href="https://wa.me/2348061904041?text=I%20want%20a%20custom%20quote%20for%20my%20goods">Request custom quote</Link>
        </button>
      </CardContent>
    </Card>
  );
};