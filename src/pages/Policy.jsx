// src/pages/Policy.jsx
import {
  ShieldCheck,
  Mail,
  User,
  Lock,
  Database,
  Cookie,
  RefreshCw,
  FileLock,
  Scale,
} from "lucide-react";
import { Helmet } from "react-helmet";

const Policy = () => {
  return (
    <main className="min-h-screen dark:bg-black py-16 px-4">
      <Helmet>
        <title>Privacy Policy | SwiftMeta</title>
        <meta
          name="description"
          content="Privacy Policy explaining how SwiftMeta collects, uses, stores, and protects personal information in compliance with POPIA."
        />
      </Helmet>

      <div className="max-w-4xl mx-auto bg-white/80 dark:bg-white/5 backdrop-blur-xl dark:border-white/10 p-8 md:p-12 rounded-3xl">
        {/* Header */}
        <header className="mb-10">
          <h1 className="text-4xl font-semibold flex items-center gap-3 text-gray-900 dark:text-white">
            <ShieldCheck className="text-purple-600" />
            Privacy Policy
          </h1>
          <p className="mt-3 text-gray-600 dark:text-gray-400 max-w-2xl">
            This Privacy Policy explains how SwiftMeta collects, uses, stores,
            and protects personal information when you use our platform,
            including when submitting applications.
          </p>
        </header>

        {/* Section 1 */}
        <Section
          icon={<User className="text-blue-600" />}
          title="1. Information We Collect"
        >
          <ul className="list-disc ml-6 space-y-2">
            <li>Personal details such as name, email address, and location.</li>
            <li>
              Identification information, including South African ID numbers.
            </li>
            <li>
              Uploaded documents such as CVs, certificates, and supporting
              files.
            </li>
            <li>
              Technical data including device type, browser information, and
              usage analytics.
            </li>
          </ul>
          <p className="mt-3">
            We collect only the information necessary to provide our services
            and process applications fairly and securely.
          </p>
        </Section>

        {/* Section 2 */}
        <Section
          icon={<Database className="text-indigo-600" />}
          title="2. How We Use Your Information"
        >
          <ul className="list-disc ml-6 space-y-2">
            <li>To process and evaluate applications.</li>
            <li>To prevent duplicate or fraudulent submissions.</li>
            <li>To communicate application updates or requests.</li>
            <li>To maintain platform security and integrity.</li>
          </ul>
          <p className="mt-3">
            Your information is never sold or used for unrelated marketing
            purposes.
          </p>
        </Section>

        {/* Section 3 */}
        <Section
          icon={<FileLock className="text-emerald-600" />}
          title="3. Document & ID Handling"
        >
          <p>
            Uploaded documents and ID numbers are handled with strict access
            controls and are only available to authorised personnel involved in
            application processing.
          </p>
          <p className="mt-2">
            These records are used solely to verify identity, assess
            applications, and comply with legal requirements.
          </p>
        </Section>

        {/* Section 4 */}
        <Section
          icon={<Lock className="text-green-700" />}
          title="4. Data Security"
        >
          <p>
            SwiftMeta implements industry-standard security measures including
            encryption, access control, secure authentication mechanisms, and
            continuous monitoring.
          </p>
          <p className="mt-2">
            Despite our efforts, no system can be guaranteed 100% secure, and
            users submit information at their own risk.
          </p>
        </Section>

        {/* Section 5 */}
        <Section
          icon={<Scale className="text-teal-600" />}
          title="5. POPIA Compliance & Your Rights"
        >
          <p>
            SwiftMeta intends to process personal information in accordance with <strong> Protection of Personal Information Act (POPIA)</strong> principles.
          </p>
          <ul className="list-disc ml-6 space-y-2 mt-2">
            <li>Request access to personal data we hold about you.</li>
            <li>Request correction of inaccurate information.</li>
            <li>Request deletion of personal data, where legally permissible.</li>
          </ul>
        </Section>

        {/* Section 6 */}
        <Section
          icon={<Cookie className="text-yellow-500" />}
          title="6. Cookies & Analytics"
        >
          <p>
            We may use cookies or similar technologies to improve functionality,
            analyse usage, and remember user preferences.
          </p>
          <p className="mt-2">
            You can control cookies through your browser settings.
          </p>
        </Section>

        {/* Section 7 */}
        <Section
  icon={<RefreshCw className="text-purple-600" />}
  title="7. Data Retention"
>
  <p>
    Personal information and application data are retained only for as long as
    necessary to fulfil their purpose or meet legal and regulatory
    requirements.
  </p>

  <p className="mt-2">
    Where you have enrolled in or completed a class, course, or program through
    SwiftMeta, your personal information and associated records will be
    securely retained for a period of up to <strong>one (1) year</strong> after
    the completion of the class.
  </p>

  <p className="mt-2">
    After this one-year retention period, your personal data and related
    records will be securely deleted or anonymised, unless:
  </p>

  <ul className="list-disc ml-6 space-y-2 mt-2">
    <li>Retention is required by law or regulatory obligations;</li>
    <li>There is an ongoing legal dispute, investigation, or audit; or</li>
    <li>You have provided explicit consent for a longer retention period.</li>
  </ul>

  <p className="mt-2">
    You may request the deletion of your personal information before this
    period, subject to legal or contractual limitations.
  </p>
</Section>

        {/* Section 8 */}
        <Section
          icon={<Mail className="text-blue-600" />}
          title="8. Contact Information"
        >
          <p>
            For privacy-related questions, data requests, or concerns, please
            contact us:
          </p>

          <div className="mt-4 p-4 rounded-2xl bg-gray-100 dark:bg-white/10 border border-black/5 dark:border-white/10">
            <p className="font-medium text-gray-900 dark:text-white">Email</p>
            <p className="text-gray-700 dark:text-gray-300">
              famacloud.ai@gmail.com
            </p>
          </div>
        </Section>


        {/* Footer */}
        <footer className="mt-12 pt-6 border-t border-black/5 dark:border-white/10 text-sm text-gray-600 dark:text-gray-400">
          <p>
            This Privacy Policy may be updated periodically. Continued use of
            SwiftMeta constitutes acceptance of the latest version.
          </p>
          <p className="mt-2 text-xs text-gray-500">
  SwiftMeta is currently in the process of formal business registration. These
  policies reflect our intended legal and ethical standards upon registration.
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
