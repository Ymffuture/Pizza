// src/pages/Terms.jsx
import {
  FileText,
  CheckCircle,
  AlertTriangle,
  ShieldCheck,
  Users,
  Server,
  RefreshCw,
  FileLock,
  UserCheck,
} from "lucide-react";
import { Helmet } from "react-helmet";

const Terms = () => {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-black py-16 px-4">
      <Helmet>
        <title>Terms & Conditions | SwiftMeta</title>
        <meta
          name="description"
          content="Terms and Conditions governing the use of the SwiftMeta platform, applications, and services."
        />
      </Helmet>

      <div className="max-w-4xl mx-auto bg-white/80 dark:bg-white/5 backdrop-blur-xl dark:border-white/10 p-8 md:p-12 rounded-3xl shadow-xl">
        {/* Header */}
        <header className="mb-10">
          <h1 className="text-4xl font-semibold flex items-center gap-3 text-gray-900 dark:text-white">
            <FileText className="text-purple-600" />
            Terms & Conditions
          </h1>
          <p className="mt-3 text-gray-600 dark:text-gray-400 max-w-2xl">
            These Terms explain how SwiftMeta may be used, how applications are
            handled, and what is expected from users when submitting personal
            information.
          </p>
        </header>

        {/* Section 1 */}
        <Section
          icon={<CheckCircle className="text-green-600" />}
          title="1. Acceptance of Terms"
        >
          <p>
            By accessing or using SwiftMeta, including submitting an
            application, you confirm that you understand and agree to these
            Terms & Conditions.
          </p>
          <p className="mt-2">
            If you do not agree with any part of these terms, you must not use
            the platform or submit an application.
          </p>
        </Section>

        {/* Section 2 */}
        <Section
          icon={<Users className="text-blue-600" />}
          title="2. User Responsibilities"
        >
          <ul className="list-disc ml-6 space-y-2">
            <li>Provide accurate, truthful, and complete information.</li>
            <li>Submit only documents you own or are authorised to share.</li>
            <li>Use SwiftMeta only for lawful and legitimate purposes.</li>
            <li>
              Do not attempt to misuse, disrupt, or compromise the platform.
            </li>
          </ul>
        </Section>

        {/* Section 3 */}
        <Section
          icon={<UserCheck className="text-indigo-600" />}
          title="3. Applications & Uniqueness"
        >
          <p>
            Only <strong>one application per individual</strong> is permitted.
          </p>
          <p className="mt-2">
            Applications are uniquely identified using personal identifiers
            such as email address and South African ID number.
          </p>
          <p className="mt-2">
            Duplicate applications, or attempts to apply using the same ID
            number or email address more than once, may be automatically
            rejected or removed.
          </p>
        </Section>

        {/* Section 4 */}
        <Section
          icon={<FileLock className="text-emerald-600" />}
          title="4. Personal Data & Documents"
        >
          <p>
            When submitting an application, you may be required to provide
            personal information including your name, contact details, South
            African ID number, and supporting documents such as CVs or
            certificates.
          </p>
          <p className="mt-2">
            By submitting this information, you consent to its collection and
            processing for application and recruitment purposes.
          </p>
        </Section>

        {/* Section 5 */}
        <Section
          icon={<ShieldCheck className="text-green-700" />}
          title="5. Data Protection & POPIA Compliance"
        >
          <p>
            SwiftMeta processes personal information in accordance with the
            <strong> Protection of Personal Information Act (POPIA)</strong>.
          </p>
          <p className="mt-2">
            Reasonable technical and organisational safeguards are in place to
            protect personal data from unauthorised access, loss, or misuse.
          </p>
          <p className="mt-2">
            Access to application data is restricted to authorised personnel
            only.
          </p>
        </Section>

        {/* Section 6 */}
        <Section
          icon={<Server className="text-indigo-600" />}
          title="6. Platform Availability"
        >
          <p>
            We aim to keep SwiftMeta available and reliable; however,
            uninterrupted access is not guaranteed.
          </p>
          <p className="mt-2">
            Downtime may occur due to maintenance, updates, or technical issues.
          </p>
        </Section>

        {/* Section 7 */}
        <Section
          icon={<AlertTriangle className="text-yellow-500" />}
          title="7. Disclaimer & Limitation of Liability"
        >
          <p>
            SwiftMeta is provided on an “as-is” basis. Submission of an
            application does not guarantee selection, employment, or admission.
          </p>
          <p className="mt-2">
            We are not liable for losses arising from incorrect information,
            user error, or third-party services.
          </p>
        </Section>

        {/* Section 8 */}
        <Section
          icon={<RefreshCw className="text-purple-600" />}
          title="8. Changes to These Terms"
        >
          <p>
            These Terms may be updated periodically to reflect legal,
            operational, or platform changes.
          </p>
          <p className="mt-2">
            Continued use of SwiftMeta after updates constitutes acceptance of
            the revised Terms.
          </p>
        </Section>

        {/* Footer */}
        <footer className="mt-12 pt-6 border-t border-black/5 dark:border-white/10 text-sm text-gray-600 dark:text-gray-400">
          <p>
            If you have questions regarding these Terms, please contact
            SwiftMeta through the official support channels.
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
