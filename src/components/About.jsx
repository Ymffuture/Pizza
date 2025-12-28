import React from "react";
import { Helmet } from "react-helmet";
import { Code, Layers, Zap, Globe } from "lucide-react";

export default function About() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-black px-6 py-12">
      <Helmet>
        <title>About SwiftMeta</title>
        <meta
          name="description"
          content="SwiftMeta builds modern developer tools, learning platforms, and applications focused on productivity, architecture, and real-world software engineering."
        />
      </Helmet>

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">
            About SwiftMeta
          </h1>
          <p className="mt-3 text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
            Building modern developer platforms, tools, and applications that
            focus on clarity, productivity, and long-term engineering growth.
          </p>
        </header>

        {/* Intro */}
        <section className="bg-white dark:bg-white/5 rounded-2xl p-6 shadow mb-10 border border-black/5 dark:border-white/10">
          <p className="text-gray-800 dark:text-gray-300 leading-relaxed">
            <strong>SwiftMeta</strong> is more than a learning site. It is a
            growing ecosystem of tools, documentation, and applications designed
            to help developers think beyond syntax — focusing on workflows,
            architecture, performance, and sustainable software practices.
          </p>

          <p className="mt-4 text-gray-800 dark:text-gray-300 leading-relaxed">
            While the name originated from the Swift ecosystem, SwiftMeta has
            expanded into broader software engineering topics including frontend
            systems, backend APIs, tooling, and platform design.
          </p>
        </section>

        {/* What we build */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            What we build
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Feature
              icon={Code}
              title="Developer Platforms"
              text="Educational and reference platforms that explain real-world development patterns, tools, and decisions."
            />
            <Feature
              icon={Layers}
              title="Web & API Applications"
              text="Modern frontend and backend applications built with React, Node.js, APIs, authentication, and cloud services."
            />
            <Feature
              icon={Zap}
              title="Productivity Tools"
              text="Internal and public tools that help developers work faster, structure projects better, and avoid common mistakes."
            />
            <Feature
              icon={Globe}
              title="Scalable Architectures"
              text="Content and systems focused on scalability, maintainability, and production-ready engineering."
            />
          </div>
        </section>

        {/* Philosophy */}
        <section className="bg-white dark:bg-white/5 rounded-2xl p-6 shadow mb-12 border border-black/5 dark:border-white/10">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            Our philosophy
          </h2>

          <ul className="space-y-3 text-gray-800 dark:text-gray-300">
            <li>• Teach concepts the way they work in real production systems</li>
            <li>• Prefer clarity over hype or trends</li>
            <li>• Build tools that respect developers’ time</li>
            <li>• Design for long-term maintainability</li>
          </ul>
        </section>

        {/* Apps & ecosystem */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            SwiftMeta ecosystem
          </h2>

          <div className="bg-gray-100 dark:bg-white/3 rounded-xl p-5 border border-black/5 dark:border-white/10">
            <p className="text-gray-700 dark:text-gray-300">
              SwiftMeta is actively expanding into multiple applications and
              services. This site serves as both a hub and a foundation for
              future developer tools, learning platforms, and SaaS products.
            </p>

            <a
              href="https://swiftmeta.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-4 font-semibold text-sky-600 hover:underline"
            >
              Visit SwiftMeta →
            </a>
          </div>
        </section>

        {/* Usage */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            Usage
          </h2>

          <p className="text-gray-700 dark:text-gray-300 mb-3">
            This page is designed to be embedded inside a React application as a
            contextual “About” view.
          </p>

          <pre className="bg-black text-green-300 rounded-xl p-4 text-sm overflow-x-auto">
            {"<About />"}
          </pre>
        </section>

        {/* Footer */}
        <footer className="text-sm text-gray-500 dark:text-gray-500 text-center">
          © {new Date().getFullYear()} SwiftMeta. Built with clarity and purpose.
        </footer>
      </div>
    </main>
  );
}

function Feature({ icon: Icon, title, text }) {
  return (
    <div className="bg-white dark:bg-white/5 rounded-xl p-5 border border-black/5 dark:border-white/10 shadow">
      <div className="flex items-start gap-3">
        <Icon className="text-sky-500" />
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white">
            {title}
          </h3>
          <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
            {text}
          </p>
        </div>
      </div>
    </div>
  );
}
