// src/pages/ServerAPI.jsx
import React, { useState, useMemo, useCallback } from "react";
import { Helmet } from "react-helmet";
import {
  Server,
  Code,
  Shield,
  Globe,
  FileCode,
  Terminal,
  Copy,
  Zap,
  Database,
  Layers,
} from "lucide-react";

/**
 * ServerAPI page - improved UI, dark-mode aware, responsive, copy buttons,
 * industry snapshot, and practical next-steps for users.
 *
 * Drop this file in src/pages and route to it from your site.
 */

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  const onCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }, [text]);

  return (
    <button
      onClick={onCopy}
      aria-label="Copy code"
      className="inline-flex items-center gap-2 px-3 py-1 text-white rounded-md text-xs bg-gray-100 dark:bg-white/6 hover:bg-gray-200 dark:hover:bg-white/8 transition"
    >
      <Copy size={14} />
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

function CodeBlock({ children, language = "js" }) {
  return (
    <div className="relative rounded-xl overflow-hidden border border-black/5 dark:border-white/8">
      <pre className="bg-black/95 text-green-200 text-sm p-4 overflow-x-auto whitespace-pre-wrap">
        <code>{children}</code>
      </pre>
    </div>
  );
}

export default function ServerAPI() {
  const [tab, setTab] = useState("fetch");
  const headerGradient =
    "bg-gradient-to-r from-sky-600 via-purple-600 to-pink-500 text-white";

  // Small examples kept simple and copyable
  const fetchExample = useMemo(
    () => `import { useEffect, useState } from "react";

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
}`,
    []
  );

  const expressExample = useMemo(
    () => `import express from "express";
const app = express();

app.get("/api/message", (req, res) => {
  res.json({ message: "Hello from your server API!" });
});

app.listen(5000, () => console.log("Server running on port 5000"));
`,
    []
  );

  const ideas = useMemo(
    () => [
      {
        title: "Managed API Gateway",
        desc:
          "Use an API Gateway to centralize routing, rate limits, authentication (JWT/OAuth), caching and monitoring.",
        icon: Layers,
      },
      {
        title: "Serverless endpoints",
        desc:
          "For event-driven, small-latency functions use serverless (Lambda/Functions) to scale automatically and pay per use.",
        icon: Zap,
      },
      {
        title: "Secure by default",
        desc:
          "Auth, TLS, input validation, and least-privilege database access are core to production-ready APIs.",
        icon: Shield,
      },
      {
        title: "Monitoring & docs",
        desc:
          "Expose OpenAPI/Swagger, use Postman/Apigee for testing, and wire up logging + observability (Sentry, Datadog).",
        icon: FileCode,
      },
    ],
    []
  );

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-black py-12 px-6 dark:text-white mt-16">
      <Helmet>
        <title>Server & API Services | SwiftMeta</title>
        <meta
          name="description"
          content="How servers and APIs work, examples for React + Express, serverless options, API management and security best practices."
        />
      </Helmet>

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div
          className={`rounded-3xl p-8 md:p-12 shadow-xl ${headerGradient}`}
          style={{ boxShadow: "0 10px 30px rgba(0,0,0,0.12)" }}
        >
          <div className="flex items-start gap-6">
            <Server size={36} className="flex-shrink-0" />
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold">Servers & APIs</h1>
              <p className="mt-2 text-sky-100 max-w-2xl">
                Learn how APIs connect frontends to servers, how major providers
                manage APIs and serverless, plus practical steps you can take
                today. Includes secure patterns and real code examples.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          {/* Left column: Overview + action cards */}
          <aside className="space-y-6 lg:col-span-1">
            <div className="bg-white dark:bg-white/3 rounded-2xl p-6 border border-black/5 dark:border-white/8 shadow">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Globe /> Quick Overview
              </h3>
              <p className="mt-3 text-sm text-gray-700 dark:text-gray-300">
                APIs let clients (browser apps, mobile apps, other servers) call
                your logic and data over HTTP (usually JSON). Servers respond
                with structured data and enforce security, quotas, and
                business rules.
              </p>
            </div>

            <div className="bg-white dark:bg-white/3 rounded-2xl p-6 border border-black/5 dark:border-white/8 shadow space-y-4">
              <h4 className="text-md font-medium">Production checklist</h4>
              <ul className="text-sm space-y-2 text-gray-700 dark:text-gray-300">
                <li>• TLS (HTTPS) everywhere</li>
                <li>• Centralized authentication (OAuth/OpenID Connect)</li>
                <li>• Rate limiting + caching at the gateway</li>
                <li>• Observability: logs, traces, metrics</li>
                <li>• API contract (OpenAPI) + tests</li>
              </ul>
            </div>

            <div className="bg-white dark:bg-white/3 rounded-2xl p-6 border border-black/5 dark:border-white/8 shadow">
              <h4 className="text-md font-medium mb-2">We can help</h4>
              <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
                <li>• Build secure REST / GraphQL APIs</li>
                <li>• Design serverless architectures with cost control</li>
                <li>• Setup API Gateway, monitoring, and CI/CD</li>
                <li>• Harden APIs against OWASP API risks</li>
              </ul>
            </div>
          </aside>

          {/* Main content */}
          <section className="lg:col-span-2 space-y-6">
            {/* Industry snapshot */}
            <div className="bg-white dark:bg-white/3 rounded-2xl p-6 border border-black/5 dark:border-white/8 shadow">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Code /> Industry snapshot
              </h3>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-gray-50 dark:bg-black/6 border">
                  <h4 className="font-medium">AWS</h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
                    API Gateway is a fully-managed service for creating, publishing, securing and monitoring APIs at scale. Pair
                    it with Lambda for serverless or ECS/EKS for containers.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-gray-50 dark:bg-black/6 border">
                  <h4 className="font-medium">Google Cloud</h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
                    Google Cloud exposes rich REST APIs for cloud products and provides API management tools and client libraries for multiple languages.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-gray-50 dark:bg-black/6 border">
                  <h4 className="font-medium">Azure</h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
                    Azure API Management is a hybrid, multicloud platform for full API lifecycle: design, secure, publish, monitor and analyze.
                  </p>
                </div>
              </div>

              <p className="mt-3 text-xs text-gray-500">
                Sources: AWS docs, Google Cloud docs, Azure docs (links at the bottom).
              </p>
            </div>

            {/* Design/Architecture ideas */}
            <div className="bg-white dark:bg-white/3 rounded-2xl p-6 border border-black/5 dark:border-white/8 shadow">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Layers /> Architecture patterns
              </h3>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                {ideas.map((i) => {
                  const Icon = i.icon;
                  return (
                    <div key={i.title} className="p-4 rounded-lg border bg-gray-50 dark:bg-black/6">
                      <div className="flex items-start gap-3">
                        <Icon className="text-sky-500" />
                        <div>
                          <div className="font-semibold">{i.title}</div>
                          <div className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                            {i.desc}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Code examples with tabs */}
            <div className="bg-white dark:bg-white/3 rounded-2xl p-6 border border-black/5 dark:border-white/8 shadow">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold flex items-center gap-2"><FileCode /> Examples</h3>

                <div className="inline-flex gap-2 text-sm">
                  <button
                    onClick={() => setTab("fetch")}
                    className={`px-3 py-1 rounded-md ${tab === "fetch" ? "bg-sky-600 text-white" : "bg-gray-100 dark:bg-white/6"}`}
                  >
                    React fetch
                  </button>
                  <button
                    onClick={() => setTab("express")}
                    className={`px-3 py-1 rounded-md ${tab === "express" ? "bg-sky-600 text-white" : "bg-gray-100 dark:bg-white/6"}`}
                  >
                    Express API
                  </button>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                {tab === "fetch" ? (
                  <>
                    <div className="flex justify-end">
                      <CopyButton text={fetchExample} />
                    </div>
                    <CodeBlock>{fetchExample}</CodeBlock>
                  </>
                ) : (
                  <>
                    <div className="flex justify-end">
                      <CopyButton text={expressExample} />
                    </div>
                    <CodeBlock>{expressExample}</CodeBlock>
                  </>
                )}
              </div>
            </div>

            {/* Security & best practices */}
            <div className="bg-white dark:bg-white/3 rounded-2xl p-6 border border-black/5 dark:border-white/8 shadow">
              <h3 className="text-lg font-semibold flex items-center gap-2"><Shield /> Security highlights</h3>
              <ul className="mt-3 list-disc ml-6 text-sm text-gray-700 dark:text-gray-300 space-y-2">
                <li>Follow the OWASP API Security Top 10: authorization checks, proper authentication, and avoid over-exposing data.</li>
                <li>Use an API Gateway to centralize auth, rate limits, and throttling.</li>
                <li>Prefer short-lived tokens (OAuth2 / OIDC) and rotate secrets—store them in a secrets manager.</li>
                <li>Log, monitor and alert on anomalous usage (spikes, unusual paths).</li>
              </ul>
            </div>

            {/* Next steps & call-to-action */}
            <div className="bg-white dark:bg-white/3 rounded-2xl p-6 border border-black/5 dark:border-white/8 shadow flex items-center justify-between">
              <div>
                <h4 className="font-semibold">Want help building this?</h4>
                <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">We can design the API, secure it, and deploy to cloud providers or serverless platforms.</p>
              </div>
              <a
                href="/contact"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-sky-600 text-white hover:opacity-95"
              >
                Get started
              </a>
            </div>

            {/* Sources */}
            <div className="text-xs text-gray-500 mt-2">
              <strong>Sources:</strong> AWS API Gateway / Lambda docs, Google Cloud APIs docs, Azure API Management docs, OWASP API Security. (Detailed links in the panel below.)
            </div>

            <div className="mt-4 p-4 rounded-md border bg-gray-50 dark:bg-black/6 text-xs">
              <div className="font-semibold mb-2">Provider docs & security references</div>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  Amazon API Gateway & Lambda — fully-managed API gateway + serverless compute. (AWS docs)
                </li>
                <li>
                  Google Cloud APIs — programmatic interfaces and client libraries for GCP products.
                </li>
                <li>
                  Azure API Management — hybrid multicloud platform for API lifecycle.
                </li>
                <li>
                  OWASP API Security Top 10 — the most important API security risks and mitigations.
                </li>
              </ul>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
