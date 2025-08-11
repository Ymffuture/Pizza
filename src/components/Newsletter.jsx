import React from "react";

const Newsletter = () => {
  const phoneNumber = "27634414863"; // Your WhatsApp number (no +, just country code + number)
  const message = "Hello! I’d like to get the latest updates from your website."; // Pre-filled message

  const handleWhatsAppRedirect = () => {
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  return (
    <section className="dark:bg-black py-10 transition-colors duration-300">
      <div className="bg-orange-100 dark:bg-[#1F1D2B] py-16 px-6 lg:px-20 mx-4 lg:mx-16 rounded-3xl">
        <div className="max-w-2xl mx-auto text-center">
          <h4 className="text-orange-500 font-semibold uppercase mb-2">
            WhatsApp Updates
          </h4>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Get the Latest Updates
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            Tap below to chat with us on WhatsApp and never miss any update or special offer!
          </p>

          <button
            onClick={handleWhatsAppRedirect}
            className="bg-orange-500 hover:bg-orange-600 text-white font-medium px-6 py-3 rounded-full transition"
          >
            Chat on WhatsApp
          </button>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;

