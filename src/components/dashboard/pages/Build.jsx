import React, { useEffect, useRef, useState, useCallback } from "react";
import { Code2, Palette, FileCode, Play, Download, Eye } from "lucide-react";
import Editor from "@monaco-editor/react";

const defaultHTML = `<!-- index.html -->
<h1 id="title">Hello from SwiftMeta Build</h1>
<p>Click the title or change code above.</p>`;

const defaultCSS = `/* style.css */
body {
  font-family: system-ui;
  padding: 20px;
  color: #222;
}
h1 { color: #0ea5a4; cursor: pointer; }`;

const defaultJS = `// script.js
const el = document.getElementById("title");
console.log("Page Loaded. Title:", el?.textContent);

el?.addEventListener("click", () => {
  console.log("Title clicked!");
  alert("You clicked the title.");
});`;

export default function Build() {
  const [html, setHtml] = useState(defaultHTML);
  const [css, setCss] = useState(defaultCSS);
  const [js, setJs] = useState(defaultJS);

  const [activeTab, setActiveTab] = useState("html");
  const [livePreview, setLivePreview] = useState(true);
  const [logs, setLogs] = useState([]);

  const iframeRef = useRef(null);
  const blobUrlRef = useRef(null);

  const buildDocument = useCallback(
    (html, css, js) => {
      const bridge = `
        <script>
        (function(){
          function send(type, args){
            parent.postMessage({ __bridge: true, type, args }, "*");
          }
          ["log","error","warn"].forEach(fn=>{
            const old = console[fn];
            console[fn] = function(){
              send(fn, Array.from(arguments));
              old.apply(console, arguments);
            };
          });
        })();
        </script>
      `;

      return `
        <!doctype html>
        <html>
        <head>
          <style>${css}</style>
        </head>
        <body>
          ${html}
          <script>${js}</script>
          ${bridge}
        </body>
        </html>
      `;
    },
    []
  );

  const runPreview = useCallback(() => {
    if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current);

    const htmlDoc = buildDocument(html, css, js);
    const blob = new Blob([htmlDoc], { type: "text/html" });
    const url = URL.createObjectURL(blob);

    blobUrlRef.current = url;
    iframeRef.current.src = url;
  }, [html, css, js, buildDocument]);

  useEffect(() => {
    if (livePreview) runPreview();
  }, [html, css, js, livePreview, runPreview]);

  useEffect(() => {
    const handler = (e) => {
      if (!e.data?.__bridge) return;
      setLogs((l) => [
        ...l,
        { id: Date.now() + Math.random(), type: e.data.type, text: e.data.args.join(" ") },
      ]);
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        runPreview();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [runPreview]);

  const downloadFile = () => {
    const content = buildDocument(html, css, js);
    const blob = new Blob([content], { type: "text/html" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "swiftmeta-playground.html";
    a.click();
  };

  const clearLogs = () => setLogs([]);

  const tabBtn = (id, label, Icon) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`px-4 py-2 rounded-xl text-sm flex items-center gap-2 transition
        ${
          activeTab === id
            ? "bg-black text-white dark:bg-white dark:text-black shadow"
            : "hover:bg-gray-200 dark:hover:bg-white/10"
        }`}
    >
      <Icon size={16} /> {label}
    </button>
  );

  const editorOptions = {
    minimap: { enabled: false },
    scrollbar: { vertical: 'auto' },
    wordWrap: 'on',
    fontSize: 14,
    lineNumbers: 'on',
    automaticLayout: true,
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-black text-gray-900 dark:text-gray-100">
      <div className="max-w-7xl mx-auto space-y-8">

        <div className="justify-between items-center">
          <div>
            <h1 className="text-4xl font-semibold text-gray-600 dark:text-white">Build a Website and make it yours. </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              HTML / CSS / JS Playground — SwiftMeta
            </p>
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={livePreview}
                onChange={(e) => setLivePreview(e.target.checked)}
              />
              🔴 Live Preview
            </label>

            <button
              onClick={runPreview}
              className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-xl"
            >
              <Play size={16} />
            </button>

            <button
              onClick={downloadFile}
              className="px-3 py-2 border rounded-xl dark:border-white/20"
            >
              <Download size={16} />
            </button>
          </div>
        </div>

        <div className="flex gap-2 border-b border-gray-300 dark:border-white/10 pb-2">
          {tabBtn("html", "HTML", FileCode)}
          {tabBtn("css", "CSS", Palette)}
          {tabBtn("js", "JS", Code2)}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            {activeTab === "html" && (
              <Editor
                height="700px"
                language="html"
                theme="vs-dark"
                value={html}
                onChange={(value) => setHtml(value || "")}
                options={editorOptions}
              />
            )}
            {activeTab === "css" && (
              <Editor
                height="500px"
                language="css"
                theme="vs-dark"
                value={css}
                onChange={(value) => setCss(value || "")}
                options={editorOptions}
              />
            )}
            {activeTab === "js" && (
              <Editor
                height="500px"
                language="javascript"
                theme="vs-dark"
                value={js}
                onChange={(value) => setJs(value || "")}
                options={editorOptions}
              />
            )}
          </div>

          <div className="space-y-4">
            <div className="rounded-xl overflow-hidden border dark:border-white/10">
              <div className="px-4 py-2 bg-gray-200 dark:bg-white/10 flex items-center gap-2">
                <Eye size={16} /> Live Preview
              </div>

              <iframe ref={iframeRef} className="w-full h-80 bg-white dark:bg-black" />
            </div>

            <div className="rounded-xl overflow-hidden border dark:border-white/10 bg-white/30 dark:bg-white/5">
              <div className="px-4 py-2 flex justify-between border-b dark:border-white/10">
                <span>Console</span>
                <button onClick={clearLogs} className="text-xs text-gray-500">Clear</button>
              </div>

              <div className="p-3 h-40 overflow-y-auto font-mono text-xs">
                {logs.length === 0 ? (
                  <p className="text-gray-400">No logs yet...</p>
                ) : (
                  logs.map((l) => (
                    <p key={l.id} className="mb-1">
                      <b className="capitalize">{l.type}:</b> {l.text}
                    </p>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        <p className="text-xs text-gray-400">
          Tip: Press <b>Ctrl/Cmd + Enter</b> to run your code.
        </p>
      </div>
    </div>
  );
}
