// src/pages/Policy.jsx
import { ShieldCheck, Mail, User, Lock } from "lucide-react";
import { Helmet } from "react-helmet";

const Policy = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <Helmet>
        <title>Privacy Policy | Quorvex Institute</title>
        <meta name="description" content="Privacy policy outlining data collection, security, cookies, and user rights." />
      </Helmet>

      <div className="max-w-4xl mx-auto bg-white p-8 rounded-3xl shadow-lg">
        <h1 className="text-4xl font-bold mb-4 flex items-center gap-3">
          <ShieldCheck className="text-blue-600" /> Privacy Policy
        </h1>

        <p className="text-gray-700 mb-6">
          This Privacy Policy explains how Quorvex Institute (“we”, “our”, “us”) collects, uses, and protects your personal information 
          when accessing our services, website, and applications.
        </p>

        {/* Section 1 */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-2 flex items-center gap-2">
            <User className="text-blue-500" /> Information We Collect
          </h2>
          <ul className="list-disc ml-6 text-gray-700 leading-relaxed">
            <li>Name, email, phone number, and profile information.</li>
            <li>Uploaded files, images, ID copies, and documents.</li>
            <li>Browser device information and usage analytics.</li>
            <li>Account activity, authentication logs, and security events.</li>
          </ul>
        </section>

        {/* Section 2 */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-2 flex items-center gap-2">
            <Lock className="text-blue-500" /> How Your Data Is Protected
          </h2>
          <p className="text-gray-700">
            We use secure storage, JWT authentication, encryption, and auditing tools to ensure your information 
            is protected from unauthorized access. Only authorized admin personnel can view sensitive documents.
          </p>
        </section>

        {/* Section 3 */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-2 flex items-center gap-2">
            <Mail className="text-blue-500" /> Contact Us
          </h2>
          <p className="text-gray-700">
            For any privacy-related concerns or requests (data deletion, updates, etc.), contact:
          </p>

          <div className="p-4 bg-gray-100 rounded-xl mt-3">
            <p className="font-semibold">Email:</p>
            <p>support@quorvexinstitute.com</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Policy;
 
