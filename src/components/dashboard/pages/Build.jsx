import React, { useEffect, useRef, useState, useCallback } from "react";

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
    <div className="min-h-screen p-6 bg-gray-50 dark:bg-[#0b0b0c] text-gray-900 dark:text-gray-100">
      <div className="max-w-7xl mx-auto">
        <header className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold">Build a Website</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Live HTML/CSS/JS playground — sandboxed preview and console.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={livePreview}
                onChange={(e) => setLivePreview(e.target.checked)}
                className="h-4 w-4"
              />
              Live preview
            </label>

            <button
              onClick={handleRun}
              className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg shadow-sm text-sm"
              title="Run (Ctrl/Cmd + Enter)"
            >
              Run (⏎)
            </button>

            <button
              onClick={handleDownload}
              className="px-3 py-2 border rounded-lg text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Download
            </button>
          </div>
        </header>

        {/* Main layout: editors on left, preview right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Editors */}
          <div className="space-y-4">
            {/* HTML editor */}
            <div className="border rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2 bg-white/60 dark:bg-gray-900/60 border-b">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">HTML</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">index.html</span>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Auto-indent · UTF-8</div>
              </div>
              <textarea
                spellCheck={false}
                value={html}
                onChange={(e) => setHtml(e.target.value)}
                className="w-full h-44 md:h-56 p-4 bg-white/40 dark:bg-black/60 text-sm font-mono outline-none resize-none"
              />
            </div>

            {/* CSS editor */}
            <div className="border rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2 bg-white/60 dark:bg-gray-900/60 border-b">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">CSS</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">style.css</span>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Scoped to preview</div>
              </div>
              <textarea
                spellCheck={false}
                value={css}
                onChange={(e) => setCss(e.target.value)}
                className="w-full h-36 p-4 bg-white/40 dark:bg-black/60 text-sm font-mono outline-none resize-none"
              />
            </div>

            {/* JS editor */}
            <div className="border rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2 bg-white/60 dark:bg-gray-900/60 border-b">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">JS</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">script.js</span>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Sandboxed</div>
              </div>
              <textarea
                spellCheck={false}
                value={js}
                onChange={(e) => setJs(e.target.value)}
                className="w-full h-36 p-4 bg-white/40 dark:bg-black/60 text-sm font-mono outline-none resize-none"
              />
            </div>
          </div>

          {/* Preview + Console */}
          <div className="space-y-4">
            <div className="border rounded-xl overflow-hidden bg-white dark:bg-gray-900/60">
              <div className="flex items-center justify-between px-4 py-2 bg-white/60 dark:bg-gray-900/60 border-b">
                <div className="text-sm text-gray-600 dark:text-gray-300">Preview</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{isRunning ? "Running…" : "Idle"}</div>
              </div>

              <div className="w-full h-[420px] bg-gray-50 dark:bg-black">
                {/* sandboxed iframe */}
                <iframe
                  ref={iframeRef}
                  title="preview"
                  className="w-full h-full border-0 bg-white dark:bg-black"
                  sandbox="allow-scripts allow-forms"
                  srcDoc={livePreview ? undefined : undefined} // we use blob URLs; srcDoc left undefined
                />
              </div>
            </div>

            {/* Console */}
            <div className="border rounded-xl overflow-hidden bg-white dark:bg-gray-900/60">
              <div className="flex items-center justify-between px-4 py-2 bg-white/60 dark:bg-gray-900/60 border-b">
                <div className="text-sm text-gray-600 dark:text-gray-300">Console</div>
                <div className="flex items-center gap-2">
                  <button onClick={clearLogs} className="text-xs text-gray-500 hover:underline">Clear</button>
                  <span className="text-xs text-gray-400">{logs.length} logs</span>
                </div>
              </div>

              <div className="px-4 py-3 h-40 overflow-auto text-sm bg-black/5 dark:bg-white/2 font-mono">
                {logs.length === 0 ? (
                  <div className="text-gray-500 dark:text-gray-400">No logs yet — console.log will appear here.</div>
                ) : (
                  logs.slice().reverse().map((l) => (
                    <div key={l.id} className="mb-2">
                      <span className={`inline-block px-2 py-0.5 rounded text-xs mr-2 ${l.type === 'error' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-200'}`}>
                        {l.type}
                      </span>
                      <span className="text-xs">{l.text}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 text-xs text-gray-500 dark:text-gray-400">
          Tip: Press <strong>Ctrl/Cmd + Enter</strong> to run. Use Live Preview for auto updates.
        </div>
      </div>
    </div>
  );
}

 
