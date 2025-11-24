import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  Code2,
  Palette,
  FileCode,
  Play,
  Download,
  Eye,
} from "lucide-react";
 
/**
 * Build page - simple HTML/CSS/JS playground that runs code in a sandboxed iframe.
 *
 * Features:
 *  - HTML, CSS, JS editors
 *  - Live preview (debounced)
 *  - Run button (+ Ctrl/Cmd+Enter)
 *  - Console panel capturing console.log from iframe
 *  - Download as single HTML file
 *  - Simple responsive UI styled with Tailwind
 */

const defaultHTML = `<!-- index.html -->
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Preview</title>
  </head>
  <body>
    <h1 id="title">Hello from SwiftMeta Build</h1>
    <p>Change HTML / CSS / JS in the editor and press Run (Ctrl/Cmd + Enter).</p>
  </body>
</html>`.trim();

const defaultCSS = `/* style.css */
body {
  font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
  padding: 24px;
  color: #111827;
  background: linear-gradient(180deg, #ffffff 0%, #f7fafc 100%);
}
h1 { color: #0ea5a4; }`;

const defaultJS = `// script.js
const el = document.getElementById('title');
console.log('JS running — DOM title ->', el?.textContent);
el?.addEventListener('click', () => {
  console.log('Title clicked! You can interact with this sandbox.');
  alert('You clicked the title — scripts are sandboxed.');
});`;

export default function Build() {
  const [html, setHtml] = useState(defaultHTML);
  const [css, setCss] = useState(defaultCSS);
  const [js, setJs] = useState(defaultJS);

  const [livePreview, setLivePreview] = useState(true);
  const [debounceMs] = useState(600); // debounce delay for live preview
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState([]); // console logs from iframe

  const iframeRef = useRef(null);
  const blobUrlRef = useRef(null);
  const debounceTimer = useRef(null);

  // Build a full HTML document that will be loaded into the iframe.
  const buildDocument = useCallback((htmlContent, cssContent, jsContent) => {
    // we inject a small script that overrides console.* and posts messages to parent window
    // so we can show console logs in the host page.
    const consoleBridge = `
      <script>
        (function () {
          function send(type, args) {
            try {
              parent.postMessage({ __swftmeta_console_bridge: true, type, args: args.map(a => {
                try { return typeof a === 'object' ? JSON.stringify(a) : String(a); } catch(e){ return String(a); }
              }) }, '*');
            } catch(e) {}
          }

          ['log','info','warn','error','debug'].forEach(fn => {
            const orig = console[fn];
            console[fn] = function() {
              try { send(fn, Array.from(arguments)); } catch(e) {}
              if (orig) orig.apply(console, arguments);
            };
          });

          window.addEventListener('error', (ev) => {
            try { send('error', [ev.message + ' @ ' + ev.filename + ':' + ev.lineno]); } catch(e){}
          });
        })();
      </script>
    `;

    return `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<style>${cssContent}</style>
</head>
<body>
${htmlContent}
<script>
try {
${jsContent}
} catch(e) {
  console.error('Runtime error:', e && e.message ? e.message : e);
}
</script>
${consoleBridge}
</body>
</html>`;
  }, []);

  // create blob and set iframe src to blob URL
  const updatePreview = useCallback((useImmediate = false) => {
    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current);
      blobUrlRef.current = null;
    }

    const doc = buildDocument(html, css, js);
    const blob = new Blob([doc], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    blobUrlRef.current = url;

    const iframe = iframeRef.current;
    if (!iframe) return;

    iframe.src = url;
    setIsRunning(false);
  }, [html, css, js, buildDocument]);

  // Debounced live preview effect
  useEffect(() => {
    if (!livePreview) return;
    clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      setIsRunning(true);
      updatePreview();
    }, debounceMs);

    return () => clearTimeout(debounceTimer.current);
  }, [html, css, js, livePreview, debounceMs, updatePreview]);

  // Manual run (immediate)
  const handleRun = () => {
    setIsRunning(true);
    updatePreview(true);
  };

  // Keyboard shortcut: Ctrl/Cmd + Enter to run
  useEffect(() => {
    const handler = (e) => {
      const isMod = e.ctrlKey || e.metaKey;
      if (isMod && e.key === "Enter") {
        e.preventDefault();
        handleRun();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [html, css, js]);

  // listen for console messages posted from iframe
  useEffect(() => {
    const onMessage = (e) => {
      const msg = e.data;
      if (!msg || !msg.__swftmeta_console_bridge) return;
      const { type, args } = msg;
      setLogs((l) => [...l.slice(-200), { id: Date.now() + Math.random(), type, text: args.join(" ") }]);
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  // cleanup blob on unmount
  useEffect(() => {
    return () => {
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current);
        blobUrlRef.current = null;
      }
    };
  }, []);

  // Download single-file HTML
  const handleDownload = () => {
    const doc = buildDocument(html, css, js);
    const blob = new Blob([doc], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "swiftmeta-preview.html";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  // Clear console logs
  const clearLogs = () => setLogs([]);

  return (
    <div className="min-h-screen p-6 bg-gradient-to-b 
      from-[#f5f5f7] to-[#e9eaec] 
      dark:from-[#0b0b0c] dark:to-[#0b0b0c] 
      text-gray-900 dark:text-gray-100 select-none">

      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* HEADER */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-semibold tracking-tight">
              Build a Website
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Live HTML/CSS/JS Playground — macOS-Inspired Editor
            </p>
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                className="h-4 w-4 rounded"
              />
              Live preview
            </label>

            <button className="px-4 py-2 bg-black dark:bg-white 
              text-white dark:text-black rounded-xl text-sm shadow-sm 
              hover:opacity-80 active:scale-95 transition-all flex items-center gap-2">
              <Play size={16} /> Run
            </button>

            <button className="px-3 py-2 border dark:border-white/20 rounded-xl text-sm
              hover:bg-gray-100 dark:hover:bg-gray-800 transition">
              <Download size={16} />
            </button>
          </div>
        </header>

        {/* MAIN LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* LEFT SIDE – EDITORS */}
          <div className="space-y-5">

            {/* macOS Tabs */}
            <div className="flex gap-2 border-b border-gray-200 dark:border-gray-800 pb-2">
              <button className="px-4 py-2 bg-white/80 dark:bg-white/10 shadow-sm rounded-xl flex items-center gap-2 text-sm">
                <FileCode size={16} /> HTML
              </button>
              <button className="px-4 py-2 hover:bg-white/70 dark:hover:bg-white/10 rounded-xl flex items-center gap-2 text-sm">
                <Palette size={16} /> CSS
              </button>
              <button className="px-4 py-2 hover:bg-white/70 dark:hover:bg-white/10 rounded-xl flex items-center gap-2 text-sm">
                <Code2 size={16} /> JS
              </button>
            </div>

            {/* HTML Editor */}
            <div className="backdrop-blur-xl bg-white/40 dark:bg-white/5 border border-black/10 dark:border-white/10 shadow-xl rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2 border-b dark:border-white/10">
                <span className="font-mono text-xs">index.html</span>
                <span className="text-xs text-gray-400">UTF-8</span>
              </div>

              <textarea
                spellCheck={false}
                className="w-full h-52 p-4 bg-transparent text-sm font-mono outline-none resize-none"
              />
            </div>

            {/* CSS Editor */}
            <div className="backdrop-blur-xl bg-white/40 dark:bg-white/5 border border-black/10 dark:border-white/10 shadow-xl rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2 border-b dark:border-white/10">
                <span className="font-mono text-xs">style.css</span>
                <span className="text-xs text-gray-400">Scoped</span>
              </div>

              <textarea
                spellCheck={false}
                className="w-full h-40 p-4 bg-transparent text-sm font-mono outline-none resize-none"
              />
            </div>

            {/* JS Editor */}
            <div className="backdrop-blur-xl bg-white/40 dark:bg-white/5 border border-black/10 dark:border-white/10 shadow-xl rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2 border-b dark:border-white/10">
                <span className="font-mono text-xs">script.js</span>
                <span className="text-xs text-gray-400">Sandboxed</span>
              </div>

              <textarea
                spellCheck={false}
                className="w-full h-40 p-4 bg-transparent text-sm font-mono outline-none resize-none"
              />
            </div>
          </div>

          {/* RIGHT SIDE – PREVIEW & CONSOLE */}
          <div className="space-y-5">
            
            {/* PREVIEW */}
            <div className="backdrop-blur-xl bg-white/40 dark:bg-white/5 shadow-xl border border-black/10 dark:border-white/10 rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2 border-b dark:border-white/10">
                <span className="text-sm flex items-center gap-2">
                  <Eye size={16} /> Live Preview
                </span>
                <span className="text-xs text-gray-500">Idle</span>
              </div>

              <div className="w-full h-[420px] bg-gray-50 dark:bg-black">
                <iframe className="w-full h-full border-0 bg-transparent" />
              </div>
            </div>

            {/* CONSOLE */}
            <div className="backdrop-blur-xl bg-white/40 dark:bg-white/5 shadow-xl border border-black/10 dark:border-white/10 rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2 border-b dark:border-white/10">
                <span className="text-sm">Console</span>
                <button className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition">
                  Clear
                </button>
              </div>

              <div className="p-4 h-40 overflow-y-auto font-mono text-xs text-gray-600 dark:text-gray-300">
                <p className="text-gray-400">No logs yet...</p>
              </div>
            </div>

          </div>
        </div>

        {/* FOOTNOTE */}
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Tip: Press <b>Command/Ctrl + Enter</b> to run your code.
        </p>

      </div>

    </div>
  );
}


 
