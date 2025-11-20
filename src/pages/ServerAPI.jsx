// src/pages/ServerAPI.jsx
import { Server, Code, Shield } from "lucide-react";
import { Helmet } from "react-helmet";

const ServerAPI = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <Helmet>
        <title>Server & API Services | Quorvex Institute</title>
        <meta name="description" content="Backend servers, Node.js APIs, cloud deployment, and integration services." />
      </Helmet>

      <div className="max-w-5xl mx-auto bg-white p-8 rounded-3xl shadow-xl">
        <h1 className="text-4xl font-bold flex items-center gap-3 mb-6">
          <Server className="text-teal-600" /> Server & API Development
        </h1>

        <p className="text-gray-700 mb-6">
          We provide secure, scalable backend systems—perfect for mobile apps, dashboards, AI integrations, 
          and cloud-based platforms.
        </p>

        <h2 className="text-2xl font-semibold mb-3">Technologies We Use</h2>

        <ul className="space-y-3">
          <li className="flex items-center gap-3">
            <Code className="text-teal-500" /> Node.js / Express REST APIs
          </li>
          <li className="flex items-center gap-3">
            <Code className="text-teal-500" /> MongoDB, PostgreSQL, Firebase
          </li>
          <li className="flex items-center gap-3">
            <Code className="text-teal-500" /> Cloudinary for file storage
          </li>
          <li className="flex items-center gap-3">
            <Shield className="text-red-500" /> JWT authentication & OAuth login
          </li>
        </ul>

        <p className="mt-6 text-gray-700">
          All backend projects include documentation, error handling, monitoring, and deployment.
        </p>
      </div>
    </div>
  );
};

export default ServerAPI;
