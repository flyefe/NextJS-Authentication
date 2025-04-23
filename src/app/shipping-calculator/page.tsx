import ShippingCalculator from "@/components/ShippingCalculator";

export default function ShippingCalculatorPage() {
  return (
    <main className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Shipping Calculator</h1>
        <ShippingCalculator />
      </div>
    </main>
  );
}
