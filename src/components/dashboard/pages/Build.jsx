import React, { useEffect, useRef, useState, useCallback } from "react";
import { Code2, Palette, FileCode, Play, Download, Eye } from "lucide-react";
import Editor from "@monaco-editor/react";
import {defaultHTML, defaultCSS, defaultJS} from "./Playground" ;
import { FiInfo, FiAlertTriangle, FiXCircle } from 'react-icons/fi';

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
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <!-- Tailwind CSS CDN -->
    <script src="https://cdn.tailwindcss.com"></script>

    <!-- Optional: Tailwind config -->
    <script>
      tailwind.config = {
        theme: {
          extend: {
            colors: {
              accent: '#0ea5a4',
            },
          },
        },
      }
    </script>

    <!-- User CSS -->
    <style>
      ${css}
    </style>
  </head>

  <body class="bg-gray-50 text-gray-900">
    ${html}

    <!-- User JS -->
    <script>
      ${js}
    </script>

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
          <div className="gap-4 p-2" >
            <h1 className="text-4xl font-semibold text-gray-600 dark:text-white">Start building your website. </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              HTML / CSS & <span className="text-blue-600" ><a href="https://tailwindcss.com/docs/installation/using-vite" >tailwindcss</a></span> / JS Playground — SwiftMeta
            </p>
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={livePreview}
                onChange={(e) => setLivePreview(e.target.checked)}
              />
            <span className="animate-pulse transaction duration-300" >🔴</span> Live Preview
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
                height="500px"
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

              <iframe ref={iframeRef} className="w-full h-90 bg-white dark:bg-black" />
            </div>

            <div className="rounded-xl overflow-hidden border dark:border-white/10 bg-white/30 dark:bg-white/5">
              <div className="px-4 py-2 flex justify-between border-b dark:border-white/10">
                <span>Terminal (console) </span>
                <button onClick={clearLogs} className="text-xs text-gray-500">Clear terminal</button>
              </div>

              <div className="p-3 h-40 overflow-y-auto font-mono text-xs">
                {logs.length === 0 ? (
                  <p className="text-gray-400">No logs yet...</p>
                ) : (
                  logs.map((l) => {
  const isInfo = l.type === 'log';
  const isWarn = l.type === 'warn';
  const isError = l.type === 'error';

  return (
    <p key={l.id} className={`mb-1 flex items-center gap-1
        ${isInfo ? 'text-white' : ''}
        ${isWarn ? 'text-yellow-500' : ''}
        ${isError ? 'text-red-500' : ''} `} >
      {isInfo && <FiInfo className="text-blue-500" />}
      {isWarn && <FiAlertTriangle className="text-yellow-500" />}
      {isError && <FiXCircle className="text-red-500" />}
      {' '}
      {l.text}
    </p>
  );
})
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
