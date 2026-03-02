// src/pages/Policy.jsx
import { Helmet } from "react-helmet";

const Policy = () => {
  return (
    <main className="min-h-screen bg-white dark:bg-black py-16 px-4">
      <Helmet>
        <title>Legal Policies | SwiftMeta</title>
        <meta
          name="description"
          content="Privacy Policy, Terms of Service, and Refund Policy for SwiftMeta."
        />
      </Helmet>

      <div className="max-w-3xl mx-auto bg-white dark:bg-black p-8 md:p-12 border border-gray-200 dark:border-gray-800">
        {/* Header */}
        <header className="mb-12 border-b border-gray-200 dark:border-gray-800 pb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Legal Policies
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Last updated: March 2, 2026
          </p>
        </header>

        {/* PRIVACY POLICY SECTION */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 uppercase tracking-wide">
            Privacy Policy
          </h2>

          <div className="space-y-6 text-gray-700 dark:text-gray-300">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                1. Information We Collect
              </h3>
              <ul className="list-disc ml-6 space-y-1">
                <li>Personal details such as name, email address, and location.</li>
                <li>Identification information, including South African ID numbers.</li>
                <li>Uploaded documents such as CVs, certificates, and supporting files.</li>
                <li>Technical data including device type, browser information, and usage analytics.</li>
              </ul>
              <p className="mt-2">
                We collect only the information necessary to provide our services and process applications fairly and securely.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                2. How We Use Your Information
              </h3>
              <ul className="list-disc ml-6 space-y-1">
                <li>To process and evaluate applications.</li>
                <li>To prevent duplicate or fraudulent submissions.</li>
                <li>To communicate application updates or requests.</li>
                <li>To maintain platform security and integrity.</li>
              </ul>
              <p className="mt-2">
                Your information is never sold or used for unrelated marketing purposes.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                3. Document & ID Handling
              </h3>
              <p>
                Uploaded documents and ID numbers are handled with strict access controls and are only available to authorised personnel involved in application processing. These records are used solely to verify identity, assess applications, and comply with legal requirements.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                4. Data Security
              </h3>
              <p>
                SwiftMeta implements industry-standard security measures including encryption, access control, secure authentication mechanisms, and continuous monitoring. Despite our efforts, no system can be guaranteed 100% secure, and users submit information at their own risk.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                5. POPIA Compliance & Your Rights
              </h3>
              <p>
                SwiftMeta intends to process personal information in accordance with the <strong>Protection of Personal Information Act (POPIA)</strong> principles.
              </p>
              <ul className="list-disc ml-6 space-y-1 mt-2">
                <li>Request access to personal data we hold about you.</li>
                <li>Request correction of inaccurate information.</li>
                <li>Request deletion of personal data, where legally permissible.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                6. Cookies & Analytics
              </h3>
              <p>
                We may use cookies or similar technologies to improve functionality, analyse usage, and remember user preferences. You can control cookies through your browser settings.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                7. Data Retention
              </h3>
              <p>
                Personal information and application data are retained only for as long as necessary to fulfil their purpose or meet legal and regulatory requirements.
              </p>
              <p className="mt-2">
                Where you have enrolled in or completed a class, course, or program through SwiftMeta, your personal information and associated records will be securely retained for a period of up to <strong>one (1) year</strong> after the completion of the class.
              </p>
              <p className="mt-2">
                After this one-year retention period, your personal data and related records will be securely deleted or anonymised, unless:
              </p>
              <ul className="list-disc ml-6 space-y-1 mt-2">
                <li>Retention is required by law or regulatory obligations;</li>
                <li>There is an ongoing legal dispute, investigation, or audit; or</li>
                <li>You have provided explicit consent for a longer retention period.</li>
              </ul>
              <p className="mt-2">
                You may request the deletion of your personal information before this period, subject to legal or contractual limitations.
              </p>
            </div>
          </div>
        </section>

        {/* TERMS OF SERVICE SECTION */}
        <section className="mb-12 border-t border-gray-200 dark:border-gray-800 pt-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 uppercase tracking-wide">
            Terms of Service
          </h2>

          <div className="space-y-6 text-gray-700 dark:text-gray-300">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                1. Acceptance of Terms
              </h3>
              <p>
                By accessing or using SwiftMeta, you agree to be bound by these Terms of Service. If you do not agree to these terms, you may not use our platform.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                2. User Accounts
              </h3>
              <p>
                You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must provide accurate and complete information when creating an account.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                3. Acceptable Use
              </h3>
              <p>You agree not to:</p>
              <ul className="list-disc ml-6 space-y-1 mt-2">
                <li>Use the platform for any illegal or unauthorized purpose.</li>
                <li>Submit false, misleading, or fraudulent information.</li>
                <li>Attempt to gain unauthorized access to any part of the platform.</li>
                <li>Interfere with or disrupt the integrity or performance of the platform.</li>
                <li>Upload or transmit viruses, malware, or other malicious code.</li>
                <li>Harass, abuse, or harm other users.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                4. Intellectual Property
              </h3>
              <p>
                All content, features, and functionality on SwiftMeta are owned by SwiftMeta and are protected by copyright, trademark, and other intellectual property laws. You may not copy, modify, distribute, or create derivative works without our express written permission.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                5. Limitation of Liability
              </h3>
              <p>
                SwiftMeta shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the platform. We do not guarantee that the platform will be error-free or uninterrupted.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                6. Termination
              </h3>
              <p>
                We reserve the right to suspend or terminate your account and access to the platform at our sole discretion, without notice, for conduct that we believe violates these terms or is harmful to other users or the platform.
              </p>
            </div>
          </div>
        </section>

        {/* PAYMENT & REFUND POLICY SECTION */}
        <section className="mb-12 border-t border-gray-200 dark:border-gray-800 pt-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 uppercase tracking-wide">
            Payment & Refund Policy
          </h2>

          <div className="space-y-6 text-gray-700 dark:text-gray-300">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                1. Payment Terms
              </h3>
              <p>
                All fees for courses, services, or products offered through SwiftMeta must be paid in full before access is granted. Payments are processed securely through our payment providers. You agree to provide current, complete, and accurate billing information.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                2. No Refund Policy
              </h3>
              <p className="font-semibold text-red-600 dark:text-red-400">
                ALL SALES ARE FINAL. NO REFUNDS WILL BE ISSUED.
              </p>
              <p className="mt-2">
                Due to the nature of digital content and educational services, SwiftMeta does not offer refunds for any purchases, including but not limited to:
              </p>
              <ul className="list-disc ml-6 space-y-1 mt-2">
                <li>Course enrollments and access fees</li>
                <li>Application processing fees</li>
                <li>Subscription fees</li>
                <li>Downloadable materials or digital products</li>
                <li>Any other services or products offered on the platform</li>
              </ul>
              <p className="mt-2">
                By completing a purchase, you acknowledge and agree that you are forfeiting your right to a refund, regardless of whether you use the service or not, or if you are dissatisfied with the content for any reason.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                3. Exceptional Circumstances
              </h3>
              <p>
                Refunds will only be considered in the following exceptional circumstances:
              </p>
              <ul className="list-disc ml-6 space-y-1 mt-2">
                <li>Duplicate charges due to technical errors</li>
                <li>Service not delivered due to platform malfunction on our end</li>
                <li>Legal requirements mandating refund issuance</li>
              </ul>
              <p className="mt-2">
                All refund requests must be submitted in writing to our support email within 7 days of the transaction. SwiftMeta reserves the right to deny any refund request that does not meet these exceptional criteria.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                4. Chargebacks
              </h3>
              <p>
                Initiating a chargeback or payment dispute with your financial institution without first contacting SwiftMeta to resolve the issue constitutes a breach of these terms. We reserve the right to suspend or terminate accounts that initiate fraudulent chargebacks and to pursue legal action to recover costs and damages.
              </p>
            </div>
          </div>
        </section>

        {/* CONTACT SECTION */}
        <section className="mb-12 border-t border-gray-200 dark:border-gray-800 pt-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 uppercase tracking-wide">
            Contact Information
          </h2>
          
          <div className="text-gray-700 dark:text-gray-300">
            <p className="mb-4">
              For privacy-related questions, data requests, refund inquiries, or general concerns, please contact us:
            </p>
            
            <div className="border border-gray-200 dark:border-gray-800 p-4 bg-gray-50 dark:bg-gray-900">
              <p className="font-semibold text-gray-900 dark:text-white">Email:</p>
              <p>famacloud.ai@gmail.com</p>
            </div>

            <p className="mt-4 text-sm">
              Response time: We aim to respond to all inquiries within 2-5 business days.
            </p>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="border-t border-gray-200 dark:border-gray-800 pt-6 text-sm text-gray-600 dark:text-gray-400">
          <p className="mb-2">
            These policies may be updated periodically. Continued use of SwiftMeta constitutes acceptance of the latest version.
          </p>
          <p className="mb-2">
            SwiftMeta is currently in the process of formal business registration. These policies reflect our intended legal and ethical standards upon registration.
          </p>
          <p>
            © 2026 SwiftMeta (Pty) Ltd. All rights reserved.
          </p>
        </footer>
      </div>
    </main>
  );
};

export default Policy;
