import faqData from "../data/faqData";
import FAQList from "../components/faq/FAQList";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet";
import { HelpCircle, Sparkles, MessageCircle } from "lucide-react"; // npm install lucide-react

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  }
};

export default function FAQ() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqData.map(item => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer
      }
    }))
  };

  return (
    <>
      <Helmet>
        <title>FAQ - SwiftMeta | Common Questions & Answers</title>
        <meta name="description" content="Find answers to frequently asked questions about SwiftMeta. Learn about features, pricing, security, and more." />
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 px-4 sm:px-6 py-12 sm:py-20">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto pt-16"
        >
          {/* Header Section */}
          <motion.div variants={itemVariants} className="text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-800/50 mb-6">
              <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span className="text-sm font-medium text-indigo-700 dark:text-indigo-300">
                Help Center
              </span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight">
              Frequently Asked{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400">
                Questions
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Everything you need to know about SwiftMeta. Can't find what you're looking for? 
              <button className="inline-flex items-center gap-1 ml-1 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium underline-offset-4 hover:underline transition-colors">
                <MessageCircle className="w-4 h-4" />
                Contact us
              </button>
            </p>
          </motion.div>

          {/* Search Bar (Optional Enhancement) */}
          <motion.div variants={itemVariants} className="mb-8 sm:mb-12">
            <div className="relative max-w-xl mx-auto group">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity" />
              <div className="relative flex items-center bg-white dark:bg-slate-800 rounded-2xl shadow-lg shadow-slate-200/50 dark:shadow-slate-950/50 border border-slate-200 dark:border-slate-700 overflow-hidden">
                <HelpCircle className="w-5 h-5 text-slate-400 ml-4" />
                <input
                  type="text"
                  placeholder="Search questions..."
                  className="w-full px-4 py-4 bg-transparent text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
                />
                <kbd className="hidden sm:block mr-4 px-2 py-1 text-xs font-medium text-slate-400 bg-slate-100 dark:bg-slate-700 rounded">
                  ⌘K
                </kbd>
              </div>
            </div>
          </motion.div>

          {/* FAQ Content */}
          <motion.div variants={itemVariants}>
            <div className="bg-white dark:bg-slate-800/50 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-slate-950/50 border border-slate-200 dark:border-slate-700/50 backdrop-blur-sm overflow-hidden">
              <FAQList items={faqData} />
            </div>
          </motion.div>

          {/* Bottom CTA */}
          <motion.div variants={itemVariants} className="mt-12 sm:mt-16 text-center">
            <div className="inline-flex flex-col sm:flex-row items-center gap-4 p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-indigo-950/20 dark:to-violet-950/20 border border-indigo-100 dark:border-indigo-800/30">
              <div className="text-center sm:text-left">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
                  Still have questions?
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  Our team is here to help you get started
                </p>
              </div>
              <button className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-medium rounded-xl transition-all hover:scale-105 active:scale-95 shadow-lg shadow-indigo-500/25">
                Get in touch
              </button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}
