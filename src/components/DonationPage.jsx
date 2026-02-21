import React from "react";

export default function DonationPage() {
  const paymentLink = "https://paystack.shop/pay/donate-swiftmeta";
const StarBackground = () => (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
      <style>{`@keyframes moveStars {from { transform: translate3d(0,0,0);} to { transform: translate3d(-600px,-300px,0);} }`}</style>
      <div style={{ position: 'absolute', width: '200%', height: '200%', backgroundImage: 'radial-gradient(rgba(9, 97, 248, 0.9) 1px, transparent 1px), radial-gradient(rgba(255,255,255,0.7) 1px, transparent 1px)', backgroundSize: '490px 160px, 80px 90px', opacity: 0.3, animation: 'moveStars 150s linear infinite' }} />
      <div style={{ position: 'absolute', width: '200%', height: '200%', backgroundImage: 'radial-gradient(rgba(255,255,255,0.6) 1px, transparent 1px)', backgroundSize: '140px 140px', opacity: 0.2, animation: 'moveStars 220s linear infinite' }} />
    </div>
  );
  return (
    <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-gray-100 transition-colors duration-500">
<StarBackground/>
      {/* Hero Section */}
      <section className="px-6 pt-28 pb-20 text-center max-w-5xl mx-auto">
        <h1 className="text-5xl sm:text-6xl font-semibold tracking-tight mb-6">
          Support the Future of Learning
        </h1>

        <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
          SwiftMeta is building a modern ecosystem for web development,
          mathematics, and science education. Your support helps us create
          high-quality learning tools, mentorship programs, and real-world
          opportunities for students and developers.
        </p>

        <div className="mt-10">
          <a
            href={paymentLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-10 py-4 rounded-full bg-black dark:bg-white text-white dark:text-black text-lg font-medium transition-all duration-300 hover:scale-105 hover:opacity-90"
          >
            Donate Securely
          </a>

          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            Secure payment powered by Paystack
          </p>
        </div>
      </section>

      {/* Why Donate Section */}
      <section className="px-6 py-24 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-16">

          <div>
            <h3 className="text-xl font-semibold mb-4">
              Educational Innovation
            </h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              We develop structured learning systems combining React,
              backend engineering, mathematics logic, and applied science
              to help learners gain industry-ready skills.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">
              Access & Opportunity
            </h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Donations allow us to support students who cannot afford
              premium learning platforms and give them access to structured,
              high-quality resources.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">
              Sustainable Growth
            </h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Your contribution helps us maintain infrastructure,
              expand programs, and continuously improve the SwiftMeta
              ecosystem for long-term impact.
            </p>
          </div>

        </div>
      </section>

      {/* Transparency Section */}
      <section className="px-6 py-24 bg-gray-50 dark:bg-[#0f0f0f] border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-4xl mx-auto text-center">

          <h2 className="text-3xl font-semibold mb-6">
            Transparency & Trust
          </h2>

          <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg">
            Every donation directly supports educational development,
            platform maintenance, and new program creation. We are committed
            to responsible growth, transparency, and building long-term value
            for learners and contributors.
          </p>

          <div className="mt-12">
            <a
              href={paymentLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-12 py-4 rounded-full bg-blue-600 text-white text-lg font-medium transition-all duration-300 hover:bg-blue-700 hover:scale-105"
            >
              Contribute Now
            </a>
          </div>

        </div>
      </section>

      {/* Footer Note */}
      <footer className="px-6 py-16 text-center text-sm text-gray-500 dark:text-gray-500 border-t border-gray-200 dark:border-gray-800">
        © {new Date().getFullYear()} SwiftMeta. Empowering developers through structured education.
      </footer>

    </div>
  );
}
