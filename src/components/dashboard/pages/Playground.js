const defaultHTML = `
<!-- index.html -->
<header class="navbar flex items-center justify-between px-4 bg-white shadow-sm">
  <div class="logo text-lg font-bold">SwiftMeta</div>

  <nav class="nav-links hidden md:flex gap-4">
    <a href="#" class="nav-link active">Home</a>
    <a href="#" class="nav-link">Docs</a>
    <a href="#" class="nav-link">Playground</a>
  </nav>

  <button
    id="toggleSidebar"
    class="btn small md:hidden bg-gray-100 rounded"
  >
    ☰
  </button>
</header>

<div class="layout flex min-h-screen">
  <aside
    id="sidebar"
    class="sidebar bg-white border-r p-4 transition-transform duration-200"
  >
    <h3 class="font-semibold mb-2">Menu</h3>
    <ul class="space-y-1">
      <li><a href="#" class="side-link active">Dashboard</a></li>
      <li><a href="#" class="side-link">Components</a></li>
      <li><a href="#" class="side-link">Settings</a></li>
    </ul>
  </aside>

  <main class="content flex-1 p-6">
    <h1
      id="title"
      class="text-2xl font-bold cursor-pointer hover:text-teal-600"
    >
      Hello from SwiftMeta Build
    </h1>

    <p class="mt-2 text-sm text-teal-600">
      This playground demonstrates basic web concepts.
    </p>

    <section class="mt-6 p-4 rounded-xl border bg-gray-50 text-sm">
      <h2 class="font-semibold mb-2">Concepts Covered</h2>
      <ul class="list-disc pl-4 text-gray-700 space-y-1">
        <li>DOM selection</li>
        <li>Event listeners</li>
        <li>UI state management</li>
        <li>CSS and utility classes</li>
        <li>Console debugging</li>
      </ul>
    </section>

    <div class="actions mt-6 flex flex-wrap gap-3 items-center">
      <button
        id="primaryBtn"
        class="btn primary bg-teal-500 text-white px-4 py-2 rounded-lg"
      >
        Primary Action
      </button>

      <button
        id="secondaryBtn"
        class="btn border px-4 py-2 rounded-lg"
      >
        Secondary Action
      </button>

      <a
        href="#"
        id="linkBtn"
        class="link text-teal-600 font-medium"
      >
        Learn more →
      </a>
    </div>
  </main>
</div>
`;

const defaultCSS = `
/* style.css */
:root {
  --bg: #f9fafb;
  --card: #ffffff;
  --text: #202124;
  --muted: #6b7280;
  --accent: #0ea5a4;
  --border: #e5e7eb;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: system-ui, sans-serif;
  background: var(--bg);
  color: var(--text);
}

/* NAVBAR */
.navbar {
  height: 56px;
  background: var(--card);
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
}

.logo {
  font-weight: 700;
}

.nav-links {
  display: flex;
  gap: 16px;
}

.nav-link {
  text-decoration: none;
  color: var(--muted);
}

.nav-link.active {
  color: var(--accent);
  font-weight: 600;
}

/* LAYOUT */
.layout {
  display: flex;
  min-height: calc(100vh - 56px);
}

/* SIDEBAR */
.sidebar {
  width: 220px;
  background: var(--card);
  border-right: 1px solid var(--border);
  padding: 16px;
  transition: transform 0.2s ease;
}

.sidebar h3 {
  margin-top: 0;
}

.sidebar ul {
  list-style: none;
  padding: 0;
}

.side-link {
  display: block;
  padding: 8px;
  border-radius: 6px;
  text-decoration: none;
  color: var(--text);
}

.side-link.active,
.side-link:hover {
  background: var(--accent);
  color: white;
}

/* CONTENT */
.content {
  flex: 1;
  padding: 24px;
}

h1 {
  cursor: pointer;
}

p {
  color: var(--accent);
}

/* BUTTONS */
.actions {
  margin-top: 24px;
  display: flex;
  gap: 12px;
  align-items: center;
}

.btn {
  padding: 8px 14px;
  border-radius: 8px;
  border: 1px solid var(--border);
  background: white;
  cursor: pointer;
}

.btn.primary {
  background: var(--accent);
  color: white;
  border: none;
}

.btn.small {
  padding: 6px 10px;
}

.link {
  color: var(--accent);
  text-decoration: none;
  font-weight: 500;
}

/* MOBILE */
.sidebar.hidden {
  transform: translateX(-100%);
}
`;

const defaultJS = `
// script.js

// DOM SELECTION
const title = document.getElementById("title");
const toggleSidebarBtn = document.getElementById("toggleSidebar");
const sidebar = document.getElementById("sidebar");

const primaryBtn = document.getElementById("primaryBtn");
const secondaryBtn = document.getElementById("secondaryBtn");
const linkBtn = document.getElementById("linkBtn");

// INITIAL LOGS
console.log("SwiftMeta UI loaded");
console.log("Selected elements:", {
  title,
  toggleSidebarBtn,
  sidebar,
  primaryBtn,
  secondaryBtn,
  linkBtn,
});

if (!sidebar) {
  console.warn("Sidebar element not found");
}

if (!document.getElementById("missingElement")) {
  console.error("missingElement does not exist (demo error)");
}

// EVENTS
title?.addEventListener("click", () => {
  console.log("Title clicked");
  alert("You clicked the title");
});

toggleSidebarBtn?.addEventListener("click", () => {
  const hidden = sidebar.classList.toggle("hidden");
  console.log("Sidebar state:", hidden ? "hidden" : "visible");
});

primaryBtn?.addEventListener("click", () => {
  console.log("Primary action triggered");
  alert("Primary action executed");
});

secondaryBtn?.addEventListener("click", () => {
  console.warn("Secondary action has no implementation yet");
});

linkBtn?.addEventListener("click", (e) => {
  e.preventDefault();
  console.log("Learn more link clicked");
});
`;

export { defaultHTML, defaultCSS, defaultJS };
