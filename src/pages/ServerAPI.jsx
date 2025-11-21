// src/pages/ServerAPI.jsx
import { Server, Code, Shield, Globe, FileCode, Terminal } from "lucide-react";
import { Helmet } from "react-helmet";

const ServerAPI = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <Helmet>
        <title>Server & API Services | Quorvex Institute</title>
        <meta
          name="description"
          content="Learn how APIs work, how to fetch APIs in React, and how to create a backend server with real examples."
        />
      </Helmet>

      <div className="max-w-5xl mx-auto bg-white p-8 rounded-3xl shadow-xl">
        {/* Header */}
        <h1 className="text-4xl font-bold flex items-center gap-3 mb-6">
          <Server className="text-teal-600" /> Server & API Development
        </h1>

        {/* What is an API */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold flex items-center gap-2 mb-3">
            <Globe className="text-blue-600" /> What is an API?
          </h2>
          <p className="text-gray-700 leading-relaxed">
            An <strong>API (Application Programming Interface)</strong> allows two systems to communicate.  
            In simple terms:  
            <br />  
            <span className="italic text-teal-600 font-medium">
              “An API lets your frontend (React) talk to your backend server.”
            </span>
          </p>

          <ul className="list-disc ml-6 mt-3 text-gray-700">
            <li>React → requests data</li>
            <li>Server → responds with JSON</li>
            <li>Your app → displays it to users</li>
          </ul>
        </section>

        {/* How to Fetch API in React */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold flex items-center gap-2 mb-3">
            <FileCode className="text-green-600" /> How to Fetch an API in React
          </h2>

          <p className="text-gray-700 mb-3">
            Here is a real example of fetching data from an API using <b>fetch()</b>:
          </p>

          <pre className="bg-black text-green-400 p-4 rounded-xl text-sm overflow-x-auto">
{`import { useEffect, useState } from "react";

export default function FetchExample() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then(res => res.json())
      .then(data => setUsers(data));
  }, []);

  return (
    <div>
      <h2>Users:</h2>
      {users.map(user => (
        <p key={user.id}>{user.name}</p>
      ))}
    </div>
  );
}`}
          </pre>
        </section>

        {/* Sample Express API */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold flex items-center gap-2 mb-3">
            <Terminal className="text-purple-600" /> Example Express.js API
          </h2>

          <p className="text-gray-700 mb-3">
            This is a simple backend API written in <strong>Node.js + Express</strong>:
          </p>

          <pre className="bg-gray-900 text-yellow-300 p-4 rounded-xl text-sm overflow-x-auto">
{`import express from "express";
const app = express();

app.get("/api/message", (req, res) => {
  res.json({ message: "Hello from your server API!" });
});

app.listen(5000, () => console.log("Server running on port 5000"));`}
          </pre>

          <p className="text-gray-700 mt-3">
            You can call this API in React using:
          </p>

          <pre className="bg-gray-900 text-green-300 p-4 rounded-xl text-sm overflow-x-auto">
{`fetch("http://localhost/5000/api/message")
  .then(res => res.json())
  .then(data => console.log(data));`}
          </pre>
        </section>

        {/* Technologies Section */}
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
