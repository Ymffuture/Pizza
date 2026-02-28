import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CreditCard, 
  Building2, 
  Copy, 
  CheckCircle2, 
  Shield, 
  Heart, 
  ArrowRight,
  Wallet,
  Globe,
  Lock,
  FileText,
  Mail,
  Phone,
  ExternalLink
} from "lucide-react";

export default function DonationPage() {
  const [copiedField, setCopiedField] = useState(null);
  const [activeMethod, setActiveMethod] = useState("paystack");
  const [showAccountDetails, setShowAccountDetails] = useState(false);

  const paymentLink = "https://paystack.shop/pay/donate-swiftmeta";

  // Account details for direct transfers
  const accountDetails = {
    bank: "Capitec ",
    accountName: "SwiftMeta Educational Initiative",
    accountNumber: "1641466659",
    swiftCode: "CSMT",
    currency: "ZAR",
    referenceNote: "Donation - [Your Name]"
  };

  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const StarBackground = () => (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <style>{`
        @keyframes moveStars {
          from { transform: translate3d(0,0,0); }
          to { transform: translate3d(-600px,-300px,0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
      `}</style>
      
      {/* Primary star layer */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: 'radial-gradient(rgba(59, 130, 246, 0.8) 1px, transparent 1px), radial-gradient(rgba(147, 51, 234, 0.5) 1px, transparent 1px)',
          backgroundSize: '60px 60px, 120px 120px',
          animation: 'moveStars 150s linear infinite'
        }}
      />
      
      {/* Secondary star layer */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.6) 1px, transparent 1px)',
          backgroundSize: '140px 140px',
          animation: 'moveStars 220s linear infinite'
        }}
      />
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/50 dark:to-black/50" />
    </div>
  );

  const paymentMethods = [
    {
      id: "paystack",
      title: "Paystack (Card)",
      description: "Secure online payment with card",
      icon: CreditCard,
      color: "from-blue-600 to-blue-700",
      processingTime: "Instant",
      fees: "fees apply"
    },
    {
      id: "transfer",
      title: "Bank Transfer",
      description: "Direct bank deposit or wire",
      icon: Building2,
      color: "from-emerald-600 to-emerald-700",
      processingTime: "1-2 business days",
      fees: "Zero fees"
    },
    {
      id: "crypto",
      title: "Cryptocurrency",
      description: "BTC, ETH, USDT accepted",
      icon: Wallet,
      color: "from-orange-600 to-orange-700",
      processingTime: "10-30 mins",
      fees: "Network fees only"
    }
  ];

  const impactStats = [
    { value: "20+", label: "Students Supported", icon: Heart },
    { value: "20+", label: "Projects Funded", icon: Globe },
    { value: "98%", label: "Satisfaction Rate", icon: CheckCircle2 },
    { value: "24/7", label: "Support Available", icon: Shield }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-black text-gray-900 dark:text-gray-100 transition-colors duration-500 relative">
      <StarBackground />

      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">SM</span>
            </div>
            <span className="font-semibold text-lg">SwiftMeta</span>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <a href="/about" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">About</a>
            <a href="/programs" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">Programs</a>
            <a href="/contact" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 px-6 pt-32 pb-20 text-center max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Badge */}
          <motion.div 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium mb-6"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Heart size={16} className="animate-pulse" />
            <span>Empowering Education Worldwide</span>
          </motion.div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 dark:from-white dark:via-blue-200 dark:to-white bg-clip-text text-transparent">
            Support the Future<br />of Learning
          </h1>

          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed mb-8">
            SwiftMeta is building a modern ecosystem for web development,
            mathematics, and science education. Your support creates opportunities
            for students and developers worldwide.
          </p>

          {/* Impact Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mb-12">
            {impactStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="p-4 rounded-2xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-gray-200 dark:border-gray-700"
              >
                <stat.icon className="w-5 h-5 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Payment Methods Section */}
      <section className="relative z-10 px-6 py-16 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden"
        >
          {/* Section Header */}
          <div className="p-8 border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-gray-50 to-white dark:from-gray-900 dark:to-gray-900">
            <h2 className="text-2xl font-bold text-center">Choose Your Payment Method</h2>
            <p className="text-center text-gray-500 dark:text-gray-400 mt-2">Secure, transparent, and tax-deductible donations</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-0">
            {/* Method Selection */}
            <div className="lg:col-span-1 p-6 space-y-3 border-r border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
              {paymentMethods.map((method) => (
                <motion.button
                  key={method.id}
                  onClick={() => {
                    setActiveMethod(method.id);
                    setShowAccountDetails(method.id === "transfer");
                  }}
                  className={`w-full p-4 rounded-xl text-left transition-all duration-300 border-2 ${
                    activeMethod === method.id
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-md"
                      : "border-transparent hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-gradient-to-br ${method.color} text-white`}>
                      <method.icon size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm">{method.title}</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{method.description}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex gap-4 text-xs">
                    <span className="text-gray-500">
                      <span className="font-medium text-gray-700 dark:text-gray-300">Time:</span> {method.processingTime}
                    </span>
                    <span className="text-gray-500">
                      <span className="font-medium text-gray-700 dark:text-gray-300">Fees:</span> {method.fees}
                    </span>
                  </div>
                </motion.button>
              ))}

              {/* Security Badge */}
              <div className="mt-6 p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                <div className="flex items-center gap-2 text-green-700 dark:text-green-400 text-sm font-medium mb-2">
                  <Shield size={16} />
                  <span>Secure Payment</span>
                </div>
                <p className="text-xs text-green-600 dark:text-green-400">
                  256-bit SSL encryption. Your data is protected and never shared.
                </p>
              </div>
            </div>

            {/* Active Method Details */}
            <div className="lg:col-span-2 p-8">
              <AnimatePresence mode="wait">
                {activeMethod === "paystack" && (
                  <motion.div
                    key="paystack"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Pay with Card</h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
                        Quick and secure payment using your debit or credit card. 
                        All major cards accepted including Visa, Mastercard, and Verve.
                      </p>
                      
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                          <CreditCard className="text-gray-400" size={24} />
                          <div>
                            <p className="font-medium">Card Payment</p>
                            <p className="text-sm text-gray-500">Processed instantly via Paystack</p>
                          </div>
                        </div>

                        <a
                          href={paymentLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group relative w-full inline-flex items-center justify-center px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 overflow-hidden"
                        >
                          <span className="relative z-10 flex items-center gap-2">
                            Donate Securely
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                          </span>
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-blue-800 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </a>

                        <p className="text-center text-xs text-gray-500 flex items-center justify-center gap-2">
                          <Lock size={12} />
                          Secured by Paystack PCI-DSS compliant
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeMethod === "transfer" && (
                  <motion.div
                    key="transfer"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Bank Transfer Details</h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
                        Make a direct transfer to our corporate account. 
                        Please include your name in the reference for proper attribution.
                      </p>

                      <div className="space-y-3">
                        {[
                          { label: "Bank Name", value: accountDetails.bank, field: "bank" },
                          { label: "Account Name", value: accountDetails.accountName, field: "name" },
                          { label: "Account Number", value: accountDetails.accountNumber, field: "number", highlight: true },
                          { label: "SWIFT Code", value: accountDetails.swiftCode, field: "swift" },
                          { label: "Currency", value: accountDetails.currency, field: "currency" },
                        ].map((item) => (
                          <div 
                            key={item.field}
                            className={`flex items-center justify-between p-4 rounded-xl border ${
                              item.highlight 
                                ? "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800" 
                                : "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                            }`}
                          >
                            <div>
                              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">{item.label}</p>
                              <p className={`font-mono font-semibold ${item.highlight ? "text-blue-700 dark:text-blue-300 text-lg" : "text-gray-900 dark:text-white"}`}>
                                {item.value}
                              </p>
                            </div>
                            <button
                              onClick={() => copyToClipboard(item.value, item.field)}
                              className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors relative"
                              title="Copy to clipboard"
                            >
                              {copiedField === item.field ? (
                                <CheckCircle2 size={18} className="text-green-600" />
                              ) : (
                                <Copy size={18} className="text-gray-500" />
                              )}
                              {copiedField === item.field && (
                                <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded">
                                  Copied!
                                </span>
                              )}
                            </button>
                          </div>
                        ))}
                      </div>

                      <div className="mt-6 p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                        <p className="text-sm text-amber-800 dark:text-amber-300 flex items-start gap-2">
                          <FileText size={16} className="mt-0.5 flex-shrink-0" />
                          <span>
                            <strong>Important:</strong> Please use reference: <code className="bg-amber-100 dark:bg-amber-900/40 px-1 rounded">{accountDetails.referenceNote}</code> so we can acknowledge your donation.
                          </span>
                        </p>
                      </div>

                      <div className="mt-6 flex gap-4">
                        <a 
                          href="mailto:donations@swiftmeta.org?subject=Bank Transfer Donation Confirmation"
                          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        >
                          <Mail size={18} />
                          Notify Us
                        </a>
                        <button
                          onClick={() => {
                            const text = Object.entries(accountDetails).map(([k, v]) => `${k}: ${v}`).join('\n');
                            copyToClipboard(text, "all");
                          }}
                          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium hover:opacity-90 transition-opacity"
                        >
                          <Copy size={18} />
                          Copy All Details
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeMethod === "crypto" && (
                  <motion.div
                    key="crypto"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Cryptocurrency Donations</h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
                        We accept major cryptocurrencies. All crypto donations are converted 
                        to local currency upon receipt to fund our educational programs.
                      </p>

                      <div className="space-y-3">
                        {[
                          { coin: "Bitcoin (BTC)", address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh", network: "Bitcoin Network" },
                          { coin: "Ethereum (ETH)", address: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F", network: "ERC-20" },
                          { coin: "USDT", address: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F", network: "TRC-20 / ERC-20" },
                        ].map((crypto) => (
                          <div key={crypto.coin} className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <p className="font-semibold">{crypto.coin}</p>
                                <p className="text-xs text-gray-500">{crypto.network}</p>
                              </div>
                              <button
                                onClick={() => copyToClipboard(crypto.address, crypto.coin)}
                                className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                              >
                                {copiedField === crypto.coin ? <CheckCircle2 size={16} className="text-green-600" /> : <Copy size={16} className="text-gray-500" />}
                              </button>
                            </div>
                            <code className="block w-full p-2 bg-white dark:bg-black rounded text-xs font-mono text-gray-600 dark:text-gray-400 break-all">
                              {crypto.address}
                            </code>
                          </div>
                        ))}
                      </div>

                      <div className="mt-4 p-4 rounded-xl bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800">
                        <p className="text-sm text-orange-800 dark:text-orange-300">
                          <strong>Note:</strong> Please send only the specified cryptocurrency to each address. 
                          Sending other assets may result in permanent loss.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Why Donate Section */}
      <section className="relative z-10 px-6 py-24 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Why Your Support Matters</h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Every contribution directly impacts our ability to provide quality education 
            and resources to aspiring developers and students.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "Educational Innovation",
              description: "We develop structured learning systems combining React, backend engineering, mathematics logic, and applied science to help learners gain industry-ready skills.",
              icon: Globe,
              color: "blue"
            },
            {
              title: "Access & Opportunity",
              description: "Donations allow us to support students who cannot afford premium learning platforms and give them access to structured, high-quality resources.",
              icon: Heart,
              color: "purple"
            },
            {
              title: "Sustainable Growth",
              description: "Your contribution helps us maintain infrastructure, expand programs, and continuously improve the SwiftMeta ecosystem for long-term impact.",
              icon: Shield,
              color: "emerald"
            }
          ].map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-8 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className={`w-12 h-12 rounded-xl bg-${item.color}-100 dark:bg-${item.color}-900/30 flex items-center justify-center mb-4`}>
                <item.icon className={`text-${item.color}-600 dark:text-${item.color}-400`} size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Transparency Section */}
      <section className="relative z-10 px-6 py-24 bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-black border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
            <CheckCircle2 size={16} className="text-green-600" />
            <span className="text-sm font-medium">Registered Non-Profit Organization</span>
          </div>

          <h2 className="text-3xl font-bold mb-6">Transparency & Trust</h2>
          
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg mb-8">
            Every donation directly supports educational development, platform maintenance, 
            and new program creation. We publish annual reports detailing how funds are utilized.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <a href="/reports" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <FileText size={18} />
              Annual Reports
            </a>
            <a href="/contact" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <Phone size={18} />
              Contact Finance Team
            </a>
          </div>

          {/* Tax Info */}
          <div className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 max-w-2xl mx-auto">
            <h4 className="font-semibold mb-2 flex items-center gap-2 justify-center">
              <FileText size={18} />
              Tax Deductible Donations
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              SwiftMeta is a registered 501(c)(3) non-profit organization. All donations are 
              tax-deductible to the fullest extent allowed by law. You will receive a 
              receipt via email for your records.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-16 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-black">
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">SM</span>
              </div>
              <span className="font-bold text-lg">SwiftMeta</span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm max-w-sm">
              Empowering the next generation of developers through accessible, 
              high-quality education and mentorship.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li><a href="/about" className="hover:text-gray-900 dark:hover:text-white transition-colors">About Us</a></li>
              <li><a href="/programs" className="hover:text-gray-900 dark:hover:text-white transition-colors">Programs</a></li>
              <li><a href="/impact" className="hover:text-gray-900 dark:hover:text-white transition-colors">Our Impact</a></li>
              <li><a href="/careers" className="hover:text-gray-900 dark:hover:text-white transition-colors">Careers</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li className="flex items-center gap-2">
                <Mail size={14} />
                <a href="mailto:donate@swiftmeta.org" className="hover:text-gray-900 dark:hover:text-white transition-colors">
                  famacloud.ai@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={14} />
                <span>+27 63 441 4863</span>
              </li>
              <li className="flex items-center gap-2">
                <Globe size={14} />
                <span>South Africa, johannesburg south </span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="max-w-6xl mx-auto pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500 dark:text-gray-500">
          <p>© {new Date().getFullYear()} SwiftMeta. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="/privacy" className="hover:text-gray-900 dark:hover:text-white transition-colors">Privacy Policy</a>
            <a href="/terms" className="hover:text-gray-900 dark:hover:text-white transition-colors">Terms of Service</a>
            <a href="/sitemap" className="hover:text-gray-900 dark:hover:text-white transition-colors">Sitemap</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
