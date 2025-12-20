const defaultHTML = `
<!-- index.html -->
<section
  class="min-h-screen flex items-center justify-center bg-gray-50 px-6"
>
  <div
    class="max-w-2xl w-full bg-white rounded-2xl shadow-lg p-8 text-center space-y-6"
  >
    <h1
      id="heroTitle"
      class="text-3xl font-bold text-gray-900 cursor-pointer hover:text-teal-600 transition"
    >
      SwiftMeta Playground
    </h1>

    <p class="text-gray-600 text-sm leading-relaxed">
      This hero section demonstrates basic web concepts using HTML, TailwindCSS,
      and JavaScript. Open the console to see logs, warnings, and errors.
    </p>

    <div
      class="flex flex-col sm:flex-row gap-3 justify-center mt-6"
    >
      <button
        id="primaryBtn"
        class="px-5 py-2 rounded-xl bg-teal-500 text-white font-medium hover:bg-teal-600 transition"
      >
        Primary Action
      </button>

      <button
        id="secondaryBtn"
        class="px-5 py-2 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
      >
        Secondary Action
      </button>
      
      <button
        id="errorBtn"
        class="px-5 py-2 rounded-xl border border-black text-gray-700 bg-black hover:bg-gray-100 transition"
      >
        Connect Demo
      </button>
    </div>

    <div
      class="mt-6 text-xs text-gray-500 bg-gray-100 rounded-xl p-4 text-left"
    >
      <strong>Concepts demonstrated:</strong>
      <ul class="list-disc pl-5 mt-2 space-y-1">
        <li>DOM selection</li>
        <li>Click events</li>
        <li>Console debugging</li>
        <li>Tailwind utility styling</li>
      </ul>
    </div>
    
  </div>
</section>
`;

const defaultCSS = `
/* style.css */

/* This file exists to demonstrate separation of concerns.
   Tailwind handles most styling, but custom CSS is still valid. */

body {
  margin: 0;
  font-family: system-ui, sans-serif;
}
`;

const defaultJS = `
// script.js

// ===============================
// DOM SELECTION
// ===============================
const heroTitle = document.getElementById("heroTitle");
const primaryBtn = document.getElementById("primaryBtn");
const secondaryBtn = document.getElementById("secondaryBtn");
const errorBtn = document.getElementById("errorBtn");

// ===============================
// INITIAL LOGS
// ===============================
console.log("SwiftMeta playground loaded");

console.log("DOM references", {
  heroTitle,
  primaryBtn,
  secondaryBtn,
});

// Warn if something expected is missing
if (!heroTitle) {
  console.warn("Hero title element not found");
}

// Error example for learning purposes
const fakeElement = document.getElementById("doesNotExist");
if (!fakeElement) {
  console.error("Requested element doesNotExist was not found in the DOM");
}

// ===============================
// EVENT LISTENERS
// ===============================
heroTitle?.addEventListener("click", () => {
  console.log("Hero title clicked");
  alert("Hero title clicked");
});

primaryBtn?.addEventListener("click", () => {
  console.log("Primary action executed");
});

secondaryBtn?.addEventListener("click", () => {
  console.warn("Secondary action is not implemented yet");
});

errorBtn?.addEventListener("click", () => {
  console.error("Connection to server failed. ");
});
`;

export { defaultHTML, defaultCSS, defaultJS };
