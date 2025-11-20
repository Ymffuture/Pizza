// src/pages/SmallProjects.jsx
import { Laptop, CheckCircle, ArrowRight } from "lucide-react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";

const SmallProjects = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <Helmet>
        <title>Small Projects | Quorvex Institute</title>
        <meta name="description" content="Affordable and fast digital small project services." />
      </Helmet>

      <div className="max-w-5xl mx-auto bg-white p-8 rounded-3xl shadow-xl">
        <h1 className="text-4xl font-bold flex items-center gap-3 mb-6">
          <Laptop className="text-indigo-600" /> Small Projects
        </h1>

        <p className="text-gray-700 mb-6">
          Small projects are affordable and fast-delivery digital services suitable for startups or 
          individuals needing quick solutions.
        </p>

        <h2 className="text-2xl font-semibold mb-3">What We Offer</h2>

        <ul className="space-y-3">
          <li className="flex items-center gap-3">
            <CheckCircle className="text-green-500" /> Landing pages & portfolio websites
          </li>
          <li className="flex items-center gap-3">
            <CheckCircle className="text-green-500" /> Simple dashboards
          </li>
          <li className="flex items-center gap-3">
            <CheckCircle className="text-green-500" /> Authentication setup (Login / Signup)
          </li>
          <li className="flex items-center gap-3">
            <CheckCircle className="text-green-500" /> Responsive UI components
          </li>
        </ul>

        <Link
          to="/contact"
          className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl mt-8 hover:bg-indigo-700"
        >
          Start a Small Project <ArrowRight />
        </Link>
      </div>
    </div>
  );
};

export default SmallProjects;
