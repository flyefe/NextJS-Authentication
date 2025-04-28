import ShippingCalculator from "@/components/ShippingCalculator/ShippingCalculator";

export default function ShippingCalculatorPage() {
  return (
    <main className="min-h-screen bg-gray-100 py-8 w-full">
      <div className="w-full">
        <h1 className="text-2xl font-bold mb-4 text-gray-700">Shipping Calculator</h1>
        <ShippingCalculator />
      </div>
    </main>
  );
}
