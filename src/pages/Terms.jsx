import { Helmet } from "react-helmet";
import { Scale, FileText } from "lucide-react";

const Terms = () => {
  const lastUpdated = "March 2, 2026";

  return (
    <main className="min-h-screen bg-white dark:bg-black py-12 px-4 sm:px-6">
      <Helmet>
        <title>Terms & Conditions | SwiftMeta</title>
        <meta
          name="description"
          content="Terms and Conditions governing the use of the SwiftMeta platform, applications, and services."
        />
      </Helmet>

      <article className="max-w-3xl mx-auto">
        {/* Document Header */}
        <header className="mb-12 pb-8 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3 mb-6 text-gray-500 dark:text-gray-400">
            <Scale className="w-5 h-5" />
            <span className="text-sm font-medium uppercase tracking-wider">Legal Document</span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4 font-serif">
            Terms & Conditions
          </h1>
          
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-sm text-gray-600 dark:text-gray-400">
            <span>SwiftMeta (Pty) Ltd</span>
            <span className="hidden sm:inline text-gray-300 dark:text-gray-700">|</span>
            <span>Last Updated: {lastUpdated}</span>
          </div>
        </header>

        {/* Document Body */}
        <div className="prose prose-gray dark:prose-invert max-w-none font-serif">
          
          <section className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 uppercase tracking-wide">
              1. Acceptance of Terms
            </h2>
            <div className="space-y-4 text-gray-700 dark:text-gray-300 leading-7 text-justify">
              <p>
                By accessing or using SwiftMeta, including submitting an application or engaging our services, 
                you confirm that you have read, understood, and agree to be bound by these Terms & Conditions.
              </p>
              <p>
                If you do not agree with any part of these terms, you must immediately discontinue use of the 
                platform and refrain from submitting any applications or payments.
              </p>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 uppercase tracking-wide">
              2. User Responsibilities
            </h2>
            <div className="text-gray-700 dark:text-gray-300 leading-7 text-justify">
              <p className="mb-4">Users agree to:</p>
              <ul className="list-decimal ml-6 space-y-2 mb-4">
                <li>Provide accurate, truthful, and complete information at all times.</li>
                <li>Submit only documents and content they own or are legally authorized to share.</li>
                <li>Use SwiftMeta exclusively for lawful and legitimate educational or professional purposes.</li>
                <li>Refrain from any attempt to misuse, disrupt, reverse-engineer, or compromise the platform.</li>
                <li>Maintain the confidentiality of any account credentials and notify us immediately of unauthorized access.</li>
              </ul>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 uppercase tracking-wide">
              3. Applications & Uniqueness Policy
            </h2>
            <div className="space-y-4 text-gray-700 dark:text-gray-300 leading-7 text-justify">
              <p>
                <strong>One application per individual.</strong> Applications are uniquely identified using 
                personal identifiers including email address and South African ID number.
              </p>
              <p>
                Duplicate applications, or attempts to apply using the same ID number or email address multiple 
                times, will be automatically rejected and may result in permanent suspension from the platform.
              </p>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 uppercase tracking-wide">
              4. Personal Data & Document Submission
            </h2>
            <div className="space-y-4 text-gray-700 dark:text-gray-300 leading-7 text-justify">
              <p>
                Users may be required to provide personal information including full name, contact details, 
                South African ID number, and supporting documentation such as CVs, academic certificates, 
                or proof of residence.
              </p>
              <p>
                By submitting this information, you expressly consent to its collection, processing, and storage 
                for application, verification, and recruitment purposes as outlined in our Privacy Policy.
              </p>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 uppercase tracking-wide">
              5. Data Protection & POPIA Compliance
            </h2>
            <div className="space-y-4 text-gray-700 dark:text-gray-300 leading-7 text-justify">
              <p>
                SwiftMeta processes personal information in strict accordance with the 
                <em> Protection of Personal Information Act 4 of 2013 (POPIA)</em> and other applicable 
                data protection legislation.
              </p>
              <p>
                We implement reasonable technical and organizational safeguards to protect personal data from 
                unauthorized access, loss, alteration, or misuse. Access to application data is restricted to 
                authorized personnel bound by confidentiality obligations.
              </p>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 uppercase tracking-wide">
              6. Payments & Fees
            </h2>
            <div className="space-y-4 text-gray-700 dark:text-gray-300 leading-7 text-justify">
              <p>
                All fees for services, courses, tutoring sessions, or applications must be paid in full prior 
                to service delivery unless otherwise agreed in writing.
              </p>
              <p>
                <strong>No Refund Policy:</strong> All payments made to SwiftMeta are final and non-refundable. 
                This includes but is not limited to tutoring fees, course enrollments, application fees, and 
                administrative charges. No refunds will be issued for:
              </p>
              <ul className="list-decimal ml-6 space-y-2 mb-4">
                <li>Missed or cancelled sessions (including the 90-minute tutoring sessions).</li>
                <li>Change of mind or decision to discontinue services.</li>
                <li>Failure to provide required identification or documentation.</li>
                <li>Technical issues on the user's end (internet connectivity, device malfunction).</li>
                <li>Early termination of services by the user.</li>
              </ul>
              <p>
                In exceptional circumstances (platform error or service unavailability due to SwiftMeta's technical 
                failure), credit may be issued at the sole discretion of management.
              </p>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 uppercase tracking-wide">
              7. Service Delivery & Session Terms
            </h2>
            <div className="space-y-4 text-gray-700 dark:text-gray-300 leading-7 text-justify">
              <p>
                <strong>Session Duration:</strong> All tutoring sessions and consultations are strictly limited 
                to 90 minutes. Sessions will not be extended beyond this time regardless of progress or 
                completion status.
              </p>
              <p>
                <strong>Punctuality:</strong> Late arrivals will not result in session extensions. The 90-minute 
                window begins at the scheduled start time.
              </p>
              <p>
                <strong>Identification Requirement:</strong> Users must present valid identification (South African 
                ID or passport) prior to service delivery. Failure to provide valid ID will result in immediate 
                cancellation of the session without refund.
              </p>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 uppercase tracking-wide">
              8. Identification, Risk & Limitation of Responsibility
            </h2>
            <div className="space-y-4 text-gray-700 dark:text-gray-300 leading-7 text-justify">
              <p>
                Certain services require valid identification. SwiftMeta reserves the right to decline, suspend, 
                or terminate services if users refuse or fail to provide required identification.
              </p>
              <p>
                Users acknowledge that providing false, incomplete, or withheld information creates legal, 
                security, and operational risks. SwiftMeta shall not be liable for any loss, harm, legal 
                consequences, or personal risk arising from:
              </p>
              <ul className="list-decimal ml-6 space-y-2 mb-4">
                <li>Refusal to provide proper identification.</li>
                <li>Misrepresentation or omission of required personal information.</li>
                <li>Actions, disputes, or incidents resulting from incomplete or inaccurate data.</li>
              </ul>
              <p>
                All risks associated with non-compliance rest solely with the user.
              </p>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 uppercase tracking-wide">
              9. Safety, Risk & Application Compliance
            </h2>
            <div className="space-y-4 text-gray-700 dark:text-gray-300 leading-7 text-justify">
              <p>
                Where applications are incomplete, inaccurate, or missing required documentation, SwiftMeta 
                reserves the right to modify, postpone, relocate, or suspend any scheduled work or service 
                within a reasonable range deemed necessary for safety and operational integrity.
              </p>
              <p>
                SwiftMeta and its tutors, employees, or representatives shall not be held responsible for any 
                personal risk, harm, or safety-related concerns arising from the user's failure to complete 
                required application processes or provide valid identification.
              </p>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 uppercase tracking-wide">
              10. Platform Availability
            </h2>
            <div className="space-y-4 text-gray-700 dark:text-gray-300 leading-7 text-justify">
              <p>
                While we aim to maintain continuous availability, SwiftMeta does not guarantee uninterrupted 
                access. The platform may be temporarily unavailable due to maintenance, updates, or factors 
                beyond our control.
              </p>
              <p>
                We are not liable for any losses resulting from platform downtime or technical failures.
              </p>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 uppercase tracking-wide">
              11. Disclaimer & Limitation of Liability
            </h2>
            <div className="space-y-4 text-gray-700 dark:text-gray-300 leading-7 text-justify">
              <p>
                SwiftMeta is provided on an "as-is" and "as-available" basis without warranties of any kind, 
                either express or implied.
              </p>
              <p>
                Submission of an application or payment does not guarantee selection, employment, admission, 
                or specific outcomes. We are not liable for losses arising from incorrect information provided 
                by users, user error, or third-party service failures.
              </p>
              <p>
                In no event shall SwiftMeta (Pty) Ltd, its directors, employees, or agents be liable for any 
                indirect, incidental, special, consequential, or punitive damages arising out of or relating 
                to your use of the platform.
              </p>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 uppercase tracking-wide">
              12. Intellectual Property
            </h2>
            <div className="space-y-4 text-gray-700 dark:text-gray-300 leading-7 text-justify">
              <p>
                All content, materials, and resources provided through SwiftMeta, including but not limited to 
                educational content, code, designs, and documentation, remain the intellectual property of 
                SwiftMeta (Pty) Ltd unless otherwise stated.
              </p>
              <p>
                Users may not reproduce, distribute, modify, or create derivative works from any SwiftMeta 
                materials without prior written consent.
              </p>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 uppercase tracking-wide">
              13. Termination
            </h2>
            <div className="space-y-4 text-gray-700 dark:text-gray-300 leading-7 text-justify">
              <p>
                SwiftMeta reserves the right to suspend or terminate any user account without prior notice 
                for violations of these Terms, fraudulent activity, or behavior deemed harmful to the platform 
                or other users.
              </p>
              <p>
                Upon termination, all provisions of these Terms which by their nature should survive termination 
                shall survive, including ownership provisions, warranty disclaimers, indemnity, and limitations 
                of liability.
              </p>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 uppercase tracking-wide">
              14. Governing Law & Jurisdiction
            </h2>
            <div className="space-y-4 text-gray-700 dark:text-gray-300 leading-7 text-justify">
              <p>
                These Terms shall be governed by and construed in accordance with the laws of the Republic of 
                South Africa. Any disputes arising under these Terms shall be subject to the exclusive 
                jurisdiction of the South African courts.
              </p>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 uppercase tracking-wide">
              15. Changes to These Terms
            </h2>
            <div className="space-y-4 text-gray-700 dark:text-gray-300 leading-7 text-justify">
              <p>
                SwiftMeta reserves the right to modify these Terms at any time. Changes will be effective 
                immediately upon posting to the platform. Continued use of SwiftMeta following any updates 
                constitutes acceptance of the revised Terms.
              </p>
              <p>
                Users are encouraged to review this page periodically for changes. Material changes will be 
                notified via email where possible.
              </p>
            </div>
          </section>

        </div>

        {/* Document Footer */}
        <footer className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-800 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">SwiftMeta (Pty) Ltd</p>
              <p>Registration Number: [Insert Company Reg]</p>
            </div>
            <div className="text-left sm:text-right">
              <p>Questions regarding these Terms?</p>
              <a href="mailto:legal@swiftmeta.co.za" className="text-indigo-600 dark:text-indigo-400 hover:underline">
                legal@swiftmeta.co.za
              </a>
            </div>
          </div>
          <p className="mt-6 text-xs text-gray-500 dark:text-gray-600">
            © {new Date().getFullYear()} SwiftMeta (Pty) Ltd. All rights reserved. 
            This document constitutes the entire agreement between the user and SwiftMeta regarding the use of the platform.
          </p>
        </footer>
      </article>
    </main>
  );
};

export default Terms;
