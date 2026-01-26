import React, { useEffect, useRef, useState, useCallback } from "react";
import { Code2, Palette, FileCode, Play, Download, Eye } from "lucide-react";
import Editor from "@monaco-editor/react";
import { defaultHTML, defaultCSS, defaultJS } from "./Playground";
import { FiInfo, FiAlertTriangle, FiXCircle } from "react-icons/fi";
import dayjs from "dayjs";
import { Helmet } from "react-helmet";

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
    <script src="https://cdn.tailwindcss.com"></script>
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
    <style>${css}</style>
  </head>
  <body class="bg-gray-50 text-gray-900">
${html}
<script>
      try {
        ${js}
      } catch (err) {
        console.error(err);
      }
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
      setLogs((prev) => [
        ...prev,
        {
          id: Date.now() + Math.random(),
          timestamp: Date.now(),
          type: e.data.type,
          text: e.data.args.join(" "),
        },
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
    URL.revokeObjectURL(url);
  };

  const clearLogs = () => setLogs([]);

  const getIcon = (type) => {
    if (type === "log") return <FiInfo className="text-blue-400 shrink-0" />;
    if (type === "warn") return <FiAlertTriangle className="text-yellow-500 shrink-0" />;
    if (type === "error") return <FiXCircle className="text-red-500 shrink-0" />;
    return null;
  };

  const getTypeColor = (type) => {
    if (type === "log") return "text-gray-900 dark:text-white";
    if (type === "warn") return "text-yellow-500 bg-yellow-500/10";
    if (type === "error") return "text-red-500 bg-red-500/10";
    return "";
  };

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
  scrollbar: { vertical: "auto" },
  wordWrap: "on",
  fontSize: 14,
  lineHeight: 22,
  lineNumbers: "on",
  automaticLayout: true,

  padding: { top: 12 },

  cursorBlinking: "smooth",
  cursorSmoothCaretAnimation: "on",

  scrollBeyondLastLine: false,
  smoothScrolling: true,

  occurrencesHighlight: false,
  selectionHighlight: false,
  overviewRulerBorder: false,

  quickSuggestions: {
    other: true,
    comments: false,
    strings: true,
  },
  suggestOnTriggerCharacters: true,
};


  return (
    <>

      <Helmet>
      <title>Build Your Website | SwiftMeta</title>
      <meta
        name="description"
        content="Build, preview, and download a complete HTML, CSS, Tailwind, and JavaScript website instantly using SwiftMeta’s live playground."
      />
      <link
        rel="canonical"
        href="https://swiftmeta.vercel.app/dashboard/build"
      />
      {/* Dashboard pages should not be indexed */}
      <meta name="robots" content="noindex, nofollow" />
    </Helmet>
      <main
      role="main"
      aria-label="Website builder playground"
      className="min-h-screen bg-gray-100 dark:bg-black text-gray-900 dark:text-gray-100"
    >
    
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-semibold text-gray-600 dark:text-white">
              Start building your website.
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              HTML / CSS &{" "}
              <span className="text-blue-600">
                <a href="https://tailwindcss.com/docs/installation/using-vite">tailwindcss</a>
              </span>{" "}
              / JS Playground — SwiftMeta
            </p>
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={livePreview}
                onChange={(e) => setLivePreview(e.target.checked)}
              />
              <span className="animate-pulse">
                
                <svg width="12" height="12" viewBox="0 0 12 12">
  <circle cx="6" cy="6" r="3" fill="#dc2626" />
  <circle cx="6" cy="6" r="3" fill="none" stroke="#dc2626" stroke-width="1">
    <animate
      attributeName="r"
      from="3"
      to="6"
      dur="1.5s"
      repeatCount="indefinite"
    />
    <animate
      attributeName="opacity"
      from="0.8"
      to="0"
      dur="1.5s"
      repeatCount="indefinite"
    />
  </circle>
</svg>
</span> Live Preview
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
              <iframe ref={iframeRef} className="w-full h-96 bg-white" />
            </div>

            <div className="rounded-xl overflow-hidden border dark:border-white/10 bg-white/30 dark:bg-white/5">
              <div className="px-4 py-2 flex justify-between border-b dark:border-white/10">
                <span>Terminal (console)</span>
                <button onClick={clearLogs} className="text-xs text-gray-500">
                  Clear terminal
                </button>
              </div>

              <div className="p-3 h-40 overflow-y-auto font-mono text-xs">
                {logs.length === 0 ? (
                  <p className="text-gray-300 dark:opacity-100 ">console.log("Hello swiftmeta")</p>
                ) : (
                  logs.map((l) => {
                    const timestamp = dayjs(l.timestamp).format("MMM D, YYYY HH:mm:ss");

                    return (
                      <p key={l.id} className={`mb-1 flex items-center gap-1 ${getTypeColor(l.type)}`} >
                        <span className="text-gray-500 text-[8px] shrink-0">
                          {timestamp}
                        </span>
                        {getIcon(l.type)}
                        <span>{l.text}</span>
                      </p>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>

        <p className="text-xs text-gray-500">
          Tip: Press <b className="rounded border border-gray-200 shadow-lg p-1" >Ctrl/Cmd + Enter</b> to run your code.
        </p>
      </div>
    
        </main>
    </>
  );
}
