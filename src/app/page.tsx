// src/app/page.tsx
"use client";
import { useUser } from "@/hooks/useUser";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <div className="max-w-xl w-full bg-white rounded-2xl shadow-lg p-8 border border-blue-100 text-center">
        <h1 className="text-3xl font-bold mb-4 text-blue-800">
          We're almost there!
        </h1>
        <p className="text-lg text-gray-700 mt-4">
          At G-Line Logistics, we understand you're eager to proceed with your shipment order.<br />
          Our team is working diligently to make online shipment booking available directly through our platform.
        </p>
        <div className="my-6">
          <p className="text-base text-gray-800 font-semibold">In the meantime, please reach out to our support team to book your shipment:</p>
          <div className="mt-4 flex flex-col items-center gap-2">
            <span className="text-lg flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 48 48" className="inline-block align-middle" aria-label="WhatsApp"><defs><linearGradient id="wa-gradient" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#60e26b"/><stop offset="100%" stop-color="#25d366"/></linearGradient></defs><rect width="48" height="48" rx="12" fill="url(#wa-gradient)"/><path fill="#fff" d="M34.6 13.4A13.8 13.8 0 0 0 24 9.5c-7.6 0-13.8 6.2-13.8 13.8 0 2.4.6 4.7 1.7 6.8l-1.8 6.6 6.8-1.8c2 1.1 4.3 1.7 6.7 1.7h.1c7.6 0 13.8-6.2 13.8-13.8 0-3.7-1.5-7.2-4.1-9.4zm-9.1 19.7h-.1c-2.2 0-4.4-.6-6.2-1.7l-.4-.2-4 .9 1.1-3.9-.3-.4A10.9 10.9 0 0 1 13 23.3c0-6.1 5-11.1 11.1-11.1 3 0 5.7 1.2 7.8 3.2a10.9 10.9 0 0 1 3.3 7.9c0 6.1-5 11.1-11.1 11.1zm6.1-8.4c-.3-.2-1.7-.8-2-1-.3-.1-.5-.2-.7.1-.2.3-.7 1-1 1.2-.2.2-.3.2-.6.1-.3-.2-1.2-.4-2.2-1.3-.8-.7-1.3-1.5-1.5-1.7-.2-.3 0-.4.1-.6.1-.1.3-.3.4-.5.1-.2.1-.3.2-.5 0-.2 0-.4-.1-.6-.1-.2-.7-1.7-1-2.3-.3-.6-.6-.5-.8-.5-.2 0-.4 0-.6 0-.2 0-.5.1-.7.3-.2.2-1 1-1 2.4 0 1.4 1 2.7 1.2 2.9.2.2 2 3.1 5 4.2.7.2 1.2.3 1.6.2.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2z"/></svg>
              <a
                href="https://wa.me/2348061904041?text=I%20want%20to%20ship%20from..."
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-700 underline hover:text-green-900 font-semibold"
              >
                08061904041
              </a>
            </span>
            <span className="text-lg">📧 Email: <a href="mailto:support@g-linelogistics.com" className="text-blue-700 underline hover:text-blue-900 font-semibold">support@g-linelogistics.com</a></span>
          </div>
        </div>
        <p className="text-base text-gray-700 mt-2">
          We appreciate your patience and look forward to serving you.
        </p>
      </div>
    </div>
  );
}