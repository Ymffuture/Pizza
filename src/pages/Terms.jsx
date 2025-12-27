// src/pages/Terms.jsx
import {
  FileText,
  CheckCircle,
  AlertTriangle,
  ShieldCheck,
  Users,
  Server,
  RefreshCw,
} from "lucide-react";
import { Helmet } from "react-helmet";

const Terms = () => {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-black py-16 px-4">
      <Helmet>
        <title>Terms & Conditions | SwiftMeta</title>
        <meta
          name="description"
          content="Terms and Conditions for using the SwiftMeta platform, tools, and services."
        />
      </Helmet>

      <div className="max-w-4xl mx-auto bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-black/5 dark:border-white/10 p-8 md:p-12 rounded-[32px] shadow-xl">
        {/* Header */}
        <header className="mb-10">
          <h1 className="text-4xl font-semibold flex items-center gap-3 text-gray-900 dark:text-white">
            <FileText className="text-purple-600" />
            Terms & Conditions
          </h1>
          <p className="mt-3 text-gray-600 dark:text-gray-400 max-w-2xl">
            These terms explain how you can use SwiftMeta safely, responsibly,
            and effectively. Please read them carefully.
          </p>
        </header>

        {/* Section 1 */}
        <Section
          icon={<CheckCircle className="text-green-600" />}
          title="1. Acceptance of Terms"
        >
          <p>
            By accessing or using SwiftMeta, you confirm that you understand and
            agree to these Terms & Conditions. If you do not agree, you should
            stop using the platform.
          </p>
          <p className="mt-2">
            These terms apply to all users, including visitors, registered
            users, and contributors.
          </p>
        </Section>

        {/* Section 2 */}
        <Section
          icon={<Users className="text-blue-600" />}
          title="2. User Responsibilities"
        >
          <ul className="list-disc ml-6 space-y-2">
            <li>Provide accurate and up-to-date information.</li>
            <li>Use SwiftMeta only for lawful and ethical purposes.</li>
            <li>Do not attempt to exploit, reverse-engineer, or disrupt the platform.</li>
            <li>Respect other users and platform resources.</li>
          </ul>
        </Section>

        {/* Section 3 */}
        <Section
          icon={<ShieldCheck className="text-emerald-600" />}
          title="3. Security & Data Protection"
        >
          <p>
            We take reasonable measures to protect your data and platform
            integrity. However, you are responsible for maintaining the
            confidentiality of your account credentials.
          </p>
          <p className="mt-2">
            SwiftMeta is not responsible for losses caused by compromised
            accounts due to user negligence.
          </p>
        </Section>

        {/* Section 4 */}
        <Section
          icon={<Server className="text-indigo-600" />}
          title="4. Platform Availability"
        >
          <p>
            We aim to keep SwiftMeta available and reliable, but we do not
            guarantee uninterrupted access.
          </p>
          <p className="mt-2">
            Maintenance, updates, or technical issues may temporarily affect
            availability.
          </p>
        </Section>

        {/* Section 5 */}
        <Section
          icon={<AlertTriangle className="text-yellow-500" />}
          title="5. Disclaimer & Limitation of Liability"
        >
          <p>
            SwiftMeta is provided on an “as-is” basis. We are not liable for
            damages resulting from incorrect usage, data loss, or third-party
            services.
          </p>
          <p className="mt-2">
            You use the platform at your own risk.
          </p>
        </Section>

        {/* Section 6 */}
        <Section
          icon={<RefreshCw className="text-purple-600" />}
          title="6. Changes to These Terms"
        >
          <p>
            We may update these Terms from time to time to reflect platform
            improvements or legal requirements.
          </p>
          <p className="mt-2">
            Continued use of SwiftMeta after updates means you accept the
            revised Terms.
          </p>
        </Section>

        {/* Footer */}
        <footer className="mt-12 pt-6 border-t border-black/5 dark:border-white/10 text-sm text-gray-600 dark:text-gray-400">
          <p>
            If you have questions about these Terms, please contact us through
            the official SwiftMeta support channels.
          </p>
        </footer>
      </div>
    </main>
  );
};

export default Terms;

/* ----------------------------------
   Reusable Section Component
----------------------------------- */

function Section({ icon, title, children }) {
  return (
    <section className="mb-8">
      <h2 className="text-2xl font-semibold flex items-center gap-3 text-gray-900 dark:text-white mb-3">
        {icon}
        {title}
      </h2>
      <div className="text-gray-700 dark:text-gray-300 leading-relaxed">
        {children}
      </div>
    </section>
  );
}
