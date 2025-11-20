// src/pages/LargeProjects.jsx
import { Building2, CheckCircle, ArrowRight } from "lucide-react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";

const LargeProjects = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <Helmet>
        <title>Large Projects | Quorvex Institute</title>
        <meta name="description" content="Enterprise-grade large project services." />
      </Helmet>

      <div className="max-w-5xl mx-auto bg-white p-8 rounded-3xl shadow-xl">
        <h1 className="text-4xl font-bold flex items-center gap-3 mb-6">
          <Building2 className="text-purple-600" /> Large Projects
        </h1>

        <p className="text-gray-700 mb-6">
          Large projects involve complex systems, long-term architecture, and enterprise-grade implementation.
        </p>

        <h2 className="text-2xl font-semibold mb-3">Examples of Large Projects</h2>

        <ul className="space-y-3">
          <li className="flex items-center gap-3">
            <CheckCircle className="text-purple-500" /> Custom CRM & ERP systems
          </li>
          <li className="flex items-center gap-3">
            <CheckCircle className="text-purple-500" /> Multi-user platforms & SaaS systems
          </li>
          <li className="flex items-center gap-3">
            <CheckCircle className="text-purple-500" /> Complex dashboards & data analytics
          </li>
          <li className="flex items-center gap-3">
            <CheckCircle className="text-purple-500" /> E-commerce with backend integration
          </li>
        </ul>

        <Link
          to="/contact"
          className="inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-xl mt-8 hover:bg-purple-700"
        >
          Discuss Large Projects <ArrowRight />
        </Link>
      </div>
    </div>
  );
};

export default LargeProjects;
