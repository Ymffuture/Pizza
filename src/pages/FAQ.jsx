import faqData from "../data/faqData";
import FAQList from "../components/faq/FAQList";
import { motion } from "framer-motion";
import {Helmet} from "react-helmet" ;
export default function FAQ() {
  return (
    <>
    <Helmet >
      <title>FAQ - SwiftMeta</title>
      <script type="application/ld+json">
{JSON.stringify({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqData.map(item => ({
    "@type": "Question",
    "name": item.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": item.answer,
    },
  })),
})}
</script>
      </Helmet>
    
    <div className="min-h-screen dark:bg-gray-900 px-6 py-16 dark:text-white">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-3xl mx-auto"
      >
        <h1 className="text-4xl font-bold text-center mb-8 dark:text-white">
          Frequently Asked Questions
        </h1>

        <FAQList items={faqData} />
      </motion.div>
    </div>
    </>
  );
}
