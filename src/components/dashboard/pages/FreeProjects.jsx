    import { Helmet } from "react-helmet";

export default function FreeProjects() {
  const projects = [
    {
      title: "Portfolio Website",
      stack: "HTML + CSS",
      hours: "3–5 hours",
      difficulty: "Beginner",
      description:
        "A clean personal portfolio with hero section, skills, and projects.",
    },
    {
      title: "Responsive Landing Page",
      stack: "HTML + CSS",
      hours: "4–6 hours",
      difficulty: "Beginner",
      description:
        "Build a fully responsive landing page with modern UI and animations.",
    },
    {
      title: "Weather App (API Based)",
      stack: "HTML + CSS + JavaScript",
      hours: "5–8 hours",
      difficulty: "Intermediate",
      description:
        "Fetch live weather using an API, show temperature, conditions, and icons.",
    },
    {
      title: "Todo App with LocalStorage",
      stack: "HTML + CSS + JavaScript",
      hours: "3–5 hours",
      difficulty: "Beginner",
      description:
        "CRUD todo list that saves tasks locally and supports dark mode.",
    },
    {
      title: "React File Upload UI",
      stack: "React + Axios",
      hours: "6–10 hours",
      difficulty: "Intermediate",
      description:
        "Upload files to backend, show progress bar, filters, search, and previews.",
    },
    {
      title: "React Authentication UI",
      stack: "React + Node + JWT",
      hours: "8–12 hours",
      difficulty: "Advanced",
      description:
        "Login, register, forgot password, OTP, Google OAuth and state handling.",
    },
    {
      title: "Next.js Blog Starter",
      stack: "Next.js 14 (App Router)",
      hours: "6–12 hours",
      difficulty: "Intermediate",
      description:
        "Create a full blog with SSR, SEO metadata, dynamic routing, and CMS-ready structure.",
    },
    {
      title: "Next.js Ecommerce Starter",
      stack: "Next.js + Stripe",
      hours: "12–20 hours",
      difficulty: "Advanced",
      description:
        "Product pages, cart system, checkout using Stripe, SSR product rendering.",
    },
  ];

  return (
    <>
      {/* SEO */}
      <Helmet>
        <title>Free Web Development Projects | SwiftMeta</title>
        <meta
          name="description"
          content="Explore free HTML, CSS, JavaScript, React, and Next.js projects to practice web development skills from beginner to advanced level."
        />
        <link
          rel="canonical"
          href="https://swiftmeta.vercel.app/free-projects"
        />
      </Helmet>

      <main
        role="main"
        aria-label="Free web development projects"
        className="p-6 text-gray-900 dark:text-white"
      >
        <section className="max-w-7xl mx-auto">
          <header className="mb-6">
            <h1 className="text-3xl font-bold">
              Free Web Development Projects
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400 max-w-2xl">
              Practice real-world projects using HTML, CSS, JavaScript, React,
              and Next.js — carefully designed to level up your skills.
            </p>
          </header>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((p, i) => (
              <article
                key={i}
                className="p-5 rounded-xl border dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm hover:shadow-lg transition"
              >
                <h2 className="text-xl font-semibold">{p.title}</h2>

                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {p.description}
                </p>

                <ul className="mt-3 space-y-1 text-sm">
                  <li>
                    <span className="font-medium">Stack:</span> {p.stack}
                  </li>
                  <li>
                    <span className="font-medium">Difficulty:</span>{" "}
                    {p.difficulty}
                  </li>
                  <li>
                    <span className="font-medium">Estimated Time:</span>{" "}
                    {p.hours}
                  </li>
                </ul>
              </article>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
