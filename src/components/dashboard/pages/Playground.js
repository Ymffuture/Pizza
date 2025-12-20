const defaultHTML = `
<!-- index.html -->
<header class="navbar">
  <div class="logo">SwiftMeta</div>

  <nav class="nav-links">
    <a href="#" class="nav-link active">Home</a>
    <a href="#" class="nav-link">Docs</a>
    <a href="#" class="nav-link">Playground</a>
  </nav>

  <button id="toggleSidebar" class="btn small">☰</button>
</header>

<div class="layout">
  <aside id="sidebar" class="sidebar">
    <h3>Menu</h3>
    <ul>
      <li><a href="#" class="side-link active">Dashboard</a></li>
      <li><a href="#" class="side-link">Components</a></li>
      <li><a href="#" class="side-link">Settings</a></li>
    </ul>
  </aside>

  <main class="content">
    <h1 id="title">Hello from SwiftMeta Build</h1>
    <p>Click buttons, links, or edit the code above.</p>

    <div class="actions">
      <button id="primaryBtn" class="btn primary">Primary Action</button>
      <button id="secondaryBtn" class="btn">Secondary Action</button>
      <a href="#" id="linkBtn" class="link">Learn more →</a>
    </div>
  </main>
</div>
`;

const defaultCSS = `/* style.css */
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

const defaultJS = `// script.js
const title = document.getElementById("title");
const toggleSidebarBtn = document.getElementById("toggleSidebar");
const sidebar = document.getElementById("sidebar");

const primaryBtn = document.getElementById("primaryBtn");
const secondaryBtn = document.getElementById("secondaryBtn");
const linkBtn = document.getElementById("linkBtn");

console.log("SwiftMeta UI Loaded");

/* Title interaction */
title?.addEventListener("click", () => {
  alert("You clicked the title 🚀");
});

/* Sidebar toggle */
toggleSidebarBtn?.addEventListener("click", () => {
  sidebar.classList.toggle("hidden");
});

/* Buttons */
primaryBtn?.addEventListener("click", () => {
  console.log("Primary action triggered");
  alert("Primary action executed");
});

secondaryBtn?.addEventListener("click", () => {
  console.log("Secondary action triggered");
});

linkBtn?.addEventListener("click", (e) => {
  e.preventDefault();
  console.log("Learn more clicked");
});
`;
