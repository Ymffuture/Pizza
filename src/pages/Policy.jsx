// src/pages/Policy.jsx
import {
  ShieldCheck,
  Mail,
  User,
  Lock,
  Database,
  Cookie,
  RefreshCw,
} from "lucide-react";
import { Helmet } from "react-helmet";

const Policy = () => {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-black py-16 px-4">
      <Helmet>
        <title>Privacy Policy | SwiftMeta</title>
        <meta
          name="description"
          content="Privacy Policy explaining how SwiftMeta collects, uses, protects, and manages your personal data."
        />
      </Helmet>

      <div className="max-w-4xl mx-auto bg-white/80 dark:bg-white/5 backdrop-blur-xl dark:border-white/10 p-8 md:p-12">
        {/* Header */}
        <header className="mb-10">
          <h1 className="text-4xl font-semibold flex items-center gap-3 text-gray-900 dark:text-white">
            <ShieldCheck className="text-purple-600" />
            Privacy Policy
          </h1>
          <p className="mt-3 text-gray-600 dark:text-gray-400 max-w-2xl">
            This Privacy Policy explains how SwiftMeta collects, uses, and
            protects your personal information when you use our platform,
            tools, and services.
          </p>
        </header>

        {/* Section 1 */}
        <Section
          icon={<User className="text-blue-600" />}
          title="1. Information We Collect"
        >
          <ul className="list-disc ml-6 space-y-2">
            <li>Basic details such as name, email address, and contact info.</li>
            <li>Account data including authentication and activity logs.</li>
            <li>Uploaded content such as files, images, or documents.</li>
            <li>Technical data like browser type, device, and usage analytics.</li>
          </ul>
          <p className="mt-3">
            This information helps us provide a secure, reliable, and
            personalized experience.
          </p>
        </Section>

        {/* Section 2 */}
        <Section
          icon={<Database className="text-indigo-600" />}
          title="2. How We Use Your Information"
        >
          <ul className="list-disc ml-6 space-y-2">
            <li>To operate and improve SwiftMeta features.</li>
            <li>To authenticate users and prevent fraud.</li>
            <li>To provide support and respond to user requests.</li>
            <li>To monitor performance and platform security.</li>
          </ul>
        </Section>

        {/* Section 3 */}
        <Section
          icon={<Lock className="text-emerald-600" />}
          title="3. Data Protection & Security"
        >
          <p>
            We use industry-standard security practices including encryption,
            access control, secure authentication (JWT/OAuth), and monitoring
            tools to protect your data.
          </p>
          <p className="mt-2">
            Access to sensitive information is restricted to authorized
            personnel only.
          </p>
        </Section>

        {/* Section 4 */}
        <Section
          icon={<Cookie className="text-yellow-500" />}
          title="4. Cookies & Tracking"
        >
          <p>
            SwiftMeta may use cookies or similar technologies to improve user
            experience, remember preferences, and analyze usage patterns.
          </p>
          <p className="mt-2">
            You can control cookies through your browser settings.
          </p>
        </Section>

        {/* Section 5 */}
        <Section
          icon={<RefreshCw className="text-purple-600" />}
          title="5. Your Rights & Choices"
        >
          <ul className="list-disc ml-6 space-y-2">
            <li>Request access to your personal data.</li>
            <li>Request corrections or updates.</li>
            <li>Request deletion of your account or data.</li>
          </ul>
        </Section>

        {/* Section 6 */}
        <Section
          icon={<Mail className="text-blue-600" />}
          title="6. Contact Us"
        >
          <p>
            If you have questions or requests regarding this Privacy Policy,
            please contact us:
          </p>

          <div className="mt-4 p-4 rounded-2xl bg-gray-100 dark:bg-white/10 border border-black/5 dark:border-white/10">
            <p className="font-medium text-gray-900 dark:text-white">Email</p>
            <p className="text-gray-700 dark:text-gray-300">
              support@swiftmeta.dev
            </p>
          </div>
        </Section>

        {/* Footer */}
        <footer className="mt-12 pt-6 border-t border-black/5 dark:border-white/10 text-sm text-gray-600 dark:text-gray-400">
          <p>
            This Privacy Policy may be updated periodically. Continued use of
            SwiftMeta means you accept the latest version.
          </p>
        </footer>
      </div>
    </main>
  );
};

export default Policy;

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
