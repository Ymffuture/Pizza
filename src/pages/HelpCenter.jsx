import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FiHelpCircle,
  FiMail,
  FiCheckCircle,
  FiFileText,
} from "react-icons/fi";

export default function HelpCenter() {
  return (
    <>
      {/* SEO */}
      <Helmet>
        <title>Help Center | Quiz Platform</title>
        <meta
          name="description"
          content="Get help with email verification, quizzes, results, and support tickets."
        />
      </Helmet>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-6 py-16 text-gray-900 dark:text-white">
        <div className="mx-auto max-w-5xl space-y-12">

          {/* HEADER */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold">Help Center</h1>
            <p className="text-gray-600 dark:text-gray-300">
              Find answers, fix issues, or contact support.
            </p>
          </div>

          {/* HELP CARDS */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <HelpCard
              icon={<FiCheckCircle />}
              title="Email Verification"
              description="Problems verifying your email?"
              to="/faq#email-verification"
            />

            <HelpCard
              icon={<FiFileText />}
              title="Quiz & Results"
              description="Learn how quizzes work and how results are calculated."
              to="/faq#quiz"
            />

            <HelpCard
              icon={<FiHelpCircle />}
              title="Frequently Asked Questions"
              description="Common questions answered."
              to="/faq"
            />

            <HelpCard
              icon={<FiMail />}
              title="Contact Support"
              description="Open a support ticket."
              to="/support"
            />
          </div>

        </div>
      </div>
    </>
  );
}

/* ---------------------------------- */
/* Reusable Card Component             */
/* ---------------------------------- */
function HelpCard({ icon, title, description, to }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="rounded-2xl bg-white dark:bg-gray-800 p-6 shadow hover:shadow-lg"
    >
      <div className="space-y-4">
        <div className="text-3xl text-blue-600">{icon}</div>
        <h3 className="text-xl font-semibold">{title}</h3>
        <p className="text-gray-600 dark:text-gray-300">{description}</p>
        <Link
          to={to}
          className="inline-block text-blue-600 font-medium hover:underline"
        >
          Learn more →
        </Link>
      </div>
    </motion.div>
  );
}
