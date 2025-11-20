// src/pages/Terms.jsx
import { FileText, CheckCircle, AlertTriangle } from "lucide-react";
import { Helmet } from "react-helmet";

const Terms = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <Helmet>
        <title>Terms & Conditions | Quorvex Institute</title>
        <meta name="description" content="Terms and conditions for using Quorvex Institute Platform." />
      </Helmet>

      <div className="max-w-4xl mx-auto bg-white p-8 rounded-3xl shadow-lg">
        <h1 className="text-4xl font-bold mb-4 flex items-center gap-3">
          <FileText className="text-green-600" /> Terms & Conditions
        </h1>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-2">1. Acceptance of Terms</h2>
          <p className="text-gray-700">
            By accessing or using our services, you agree to comply with these Terms & Conditions. 
            If you do not agree, please discontinue use immediately.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-2">2. User Responsibilities</h2>
          <ul className="list-disc ml-6 text-gray-700">
            <li>Provide accurate personal or business information.</li>
            <li>Respect platform security and avoid fraudulent activity.</li>
            <li>Ensure uploaded files do not violate legal guidelines.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-2 flex items-center gap-2">
            <AlertTriangle className="text-yellow-500" /> 3. Disclaimer
          </h2>
          <p className="text-gray-700">
            Quorvex Institute is not liable for damages related to misuse, incorrect data, or third-party errors.
          </p>
        </section>

        <p className="text-gray-700">
          Continued use of the platform means you agree to any updated versions of this document.
        </p>
      </div>
    </div>
  );
};

export default Terms;
