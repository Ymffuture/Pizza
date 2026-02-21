import React from "react";

export default function DonationPage() {
  const paymentLink = "https://paystack.shop/pay/swiftmeta-pay";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center px-6">
      <div className="bg-white shadow-xl rounded-2xl p-10 max-w-lg w-full text-center">

        <h1 className="text-3xl font-semibold text-gray-900 mb-4">
          Support SwiftMeta
        </h1>

        <p className="text-gray-600 mb-8">
          Your donation helps us continue building educational tools,
          software projects, and learning opportunities for students and developers.
        </p>

        <a
          href={paymentLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block w-full py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition duration-200"
        >
          Donate Now
        </a>

        <p className="text-sm text-gray-400 mt-6">
          Secure payments powered by Paystack
        </p>
      </div>
    </div>
  );
}
