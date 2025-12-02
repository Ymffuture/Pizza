export default function FreeProjects() {
  const projects = [
    // ---------------------- HTML + CSS ----------------------
    {
      title: "Portfolio Website",
      stack: "HTML + CSS",
      hours: "3–5 hours",
      difficulty: "Beginner",
      description: "A clean personal portfolio with hero section, skills, and projects.",
    },
    {
      title: "Responsive Landing Page",
      stack: "HTML + CSS",
      hours: "4–6 hours",
      difficulty: "Beginner",
      description: "Build a fully responsive landing page with modern UI and animations.",
    },

    // ---------------------- JavaScript ----------------------
    {
      title: "Weather App (API Based)",
      stack: "HTML + CSS + JavaScript",
      hours: "5–8 hours",
      difficulty: "Intermediate",
      description: "Fetch live weather using an API, show temperature, conditions, and icons.",
    },
    {
      title: "Todo App with LocalStorage",
      stack: "HTML + CSS + JavaScript",
      hours: "3–5 hours",
      difficulty: "Beginner",
      description: "CRUD todo list that saves tasks locally and supports dark mode.",
    },

    // ---------------------- React ----------------------
    {
      title: "React File Upload UI",
      stack: "React + Axios",
      hours: "6–10 hours",
      difficulty: "Intermediate",
      description: "Upload files to backend, show progress bar, filters, search, and previews.",
    },
    {
      title: "React Authentication UI",
      stack: "React + Node + JWT",
      hours: "8–12 hours",
      difficulty: "Advanced",
      description: "Login, register, forgot password, OTP, Google OAuth and state handling.",
    },

    // ---------------------- Next.js ----------------------
    {
      title: "Next.js Blog Starter",
      stack: "Next.js 14 (App Router)",
      hours: "6–12 hours",
      difficulty: "Intermediate",
      description: "Create a full blog with SSR, SEO metadata, dynamic routing, and CMS-ready structure.",
    },
    {
      title: "Next.js Ecommerce Starter",
      stack: "Next.js + Stripe",
      hours: "12–20 hours",
      difficulty: "Advanced",
      description: "Product pages, cart system, checkout using Stripe, SSR product rendering.",
    },
  ];

  return (
    <div className="p-6 text-gray-900 dark:text-white">
      <h1 className="text-3xl font-bold mb-4">Free Projects</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Explore starter projects you can build to grow your skills.
      </p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((p, i) => (
          <div
            key={i}
            className="p-5 rounded-xl border dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm hover:shadow-lg transition"
          >
            <h2 className="text-xl font-semibold">{p.title}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {p.description}
            </p>

            <div className="mt-3 space-y-1 text-sm">
              <p><span className="font-medium">Stack:</span> {p.stack}</p>
              <p><span className="font-medium">Difficulty:</span> {p.difficulty}</p>
              <p><span className="font-medium">Estimated Time:</span> {p.hours}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
