import ShippingCalculator from "@/components/ShippingCalculator/ShippingCalculator";
import { FaMoneyBillWave, FaClock, FaChartLine, FaPlane, FaShip } from "react-icons/fa";

export default function ShippingCalculatorPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 w-full">
      <div className="w-full py-6"><ShippingCalculator /></div>
      <section className="max-w-6xl mx-auto px-4 py-8 md:py-14">
        <h2 className="text-2xl md:text-3xl font-extrabold text-blue-900 mb-2 text-center">Why G-Line Shipping Calculator?</h2>
        <div className="flex flex-col md:flex-row gap-4 md:gap-8 justify-center mb-10 mt-6">
          {/* Feature 1 */}
          <div className="flex-1 bg-white rounded-2xl shadow-md p-6 flex flex-col items-center border border-blue-100 min-w-[220px]">
            <span className="bg-green-100 rounded-full p-3 mb-3"><FaMoneyBillWave className="text-green-500 text-2xl" /></span>
            <div className="font-bold text-lg mb-1 text-gray-900">Comprehensive Options</div>
            <div className="text-gray-600 text-center text-sm">Compare costs across all available shipping routes and methods, with detailed breakdowns of each calculation.</div>
          </div>
          {/* Feature 2 */}
          <div className="flex-1 bg-white rounded-2xl shadow-md p-6 flex flex-col items-center border border-blue-100 min-w-[220px]">
            <span className="bg-green-100 rounded-full p-3 mb-3"><FaClock className="text-green-500 text-2xl" /></span>
            <div className="font-bold text-lg mb-1 text-gray-900">Real-Time Rates</div>
            <div className="text-gray-600 text-center text-sm">Our calculator uses up-to-date exchange rates and shipping fees to provide accurate cost estimates.</div>
          </div>
          {/* Feature 3 */}
          <div className="flex-1 bg-white rounded-2xl shadow-md p-6 flex flex-col items-center border border-blue-100 min-w-[220px]">
            <span className="bg-green-100 rounded-full p-3 mb-3"><FaChartLine className="text-green-500 text-2xl" /></span>
            <div className="font-bold text-lg mb-1 text-gray-900">Cost Optimization</div>
            <div className="text-gray-600 text-center text-sm">Easily identify the most cost-effective shipping options based on your specific requirements.</div>
          </div>
        </div>
        <h3 className="text-xl md:text-2xl font-extrabold text-blue-900 mb-3 mt-10 text-center">Our Shipping Services</h3>
        <div className="flex flex-col md:flex-row gap-4 md:gap-8 justify-center mb-10">
          {/* Service 1 */}
          <div className="flex-1 bg-white rounded-2xl shadow-md p-6 flex flex-col border border-blue-100 min-w-[280px]">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-green-100 rounded-full p-2"><FaPlane className="text-green-500 text-xl" /></span>
              <span className="font-bold text-lg text-gray-900">Air Freight</span>
            </div>
            <div className="text-gray-700 text-sm mb-2">Fast delivery solutions from China, Dubai, and UK with Express and Fast Track options.</div>
            <ul className="list-disc text-gray-600 text-xs pl-5">
              <li>Express shipping for urgent deliveries</li>
              <li>Special handling for battery and chemical goods</li>
              <li>Door-to-door services available</li>
            </ul>
          </div>
          {/* Service 2 */}
          <div className="flex-1 bg-white rounded-2xl shadow-md p-6 flex flex-col border border-blue-100 min-w-[280px]">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-green-100 rounded-full p-2"><FaShip className="text-green-500 text-xl" /></span>
              <span className="font-bold text-lg text-gray-900">Sea Freight</span>
            </div>
            <div className="text-gray-700 text-sm mb-2">Cost-effective solutions for larger cargo volumes from China and Dubai.</div>
            <ul className="list-disc text-gray-600 text-xs pl-5">
              <li>Full container and shared container options</li>
              <li>Efficient customs clearance processes</li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
