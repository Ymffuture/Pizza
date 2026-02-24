import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Code2, 
  Palette, 
  FileCode, 
  Play, 
  Download, 
  Eye, 
  Settings,
  Terminal,
  Maximize2,
  Minimize2,
  Copy,
  Check,
  RotateCcw,
  Command,
  ChevronRight,
  Layout,
  Moon,
  Sun,
  Type,
  Search,
  Replace
} from "lucide-react";
import Editor from "@monaco-editor/react";
import { defaultHTML, defaultCSS, defaultJS } from "./Playground";
import { 
  FiInfo, 
  FiAlertTriangle, 
  FiXCircle, 
  FiCheckCircle,
  FiClock
} from "react-icons/fi";
import dayjs from "dayjs";
import { Helmet } from "react-helmet";
import { Tooltip, Badge, Button, Select, Switch, Tabs, notification } from "antd";
import { useTheme } from "../hooks/useTheme";

// Custom hook for keyboard shortcuts
const useKeyboardShortcuts = (shortcuts) => {
  useEffect(() => {
    const handler = (e) => {
      Object.entries(shortcuts).forEach(([key, callback]) => {
        const [mod, k] = key.split('+');
        if ((e.ctrlKey || e.metaKey) === (mod === 'ctrl' || mod === 'cmd') && e.key === k) {
          e.preventDefault();
          callback();
        }
      });
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [shortcuts]);
};

// File icon component
const FileIcon = ({ type, active }) => {
  const icons = {
    html: <FileCode size={16} className={active ? "text-orange-400" : "text-gray-400"} />,
    css: <Palette size={16} className={active ? "text-blue-400" : "text-gray-400"} />,
    js: <Code2 size={16} className={active ? "text-yellow-400" : "text-gray-400"} />
  };
  return icons[type] || null;
};

// Tab component with close button and unsaved indicator
const EditorTab = ({ id, label, active, onClick, onClose, hasChanges, icon: Icon }) => (
  <motion.button
    layout
    onClick={onClick}
    className={`
      group relative flex items-center gap-2 px-4 py-2.5 text-sm font-medium
      border-r border-gray-200 dark:border-gray-700
      transition-all duration-200
      ${active 
        ? "bg-white dark:bg-[#1e1e1e] text-gray-900 dark:text-white border-t-2 border-t-blue-500" 
        : "bg-gray-50 dark:bg-[#252526] text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#2a2d2e]"
      }
    `}
  >
    <Icon size={16} className={active ? "text-blue-500" : ""} />
    <span className="uppercase text-xs tracking-wider">{label}</span>
    {hasChanges && (
      <span className="w-2 h-2 rounded-full bg-blue-500 ml-1" />
    )}
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClose?.();
      }}
      className={`
        ml-2 p-0.5 rounded-md opacity-0 group-hover:opacity-100
        hover:bg-gray-200 dark:hover:bg-gray-600 transition-all
        ${active ? "opacity-100" : ""}
      `}
    >
      <span className="text-xs">×</span>
    </button>
  </motion.button>
);

// Console log item component
const LogItem = ({ log, onClick }) => {
  const icons = {
    log: <FiInfo className="text-blue-400 shrink-0" size={14} />,
    warn: <FiAlertTriangle className="text-yellow-500 shrink-0" size={14} />,
    error: <FiXCircle className="text-red-500 shrink-0" size={14} />,
    success: <FiCheckCircle className="text-green-500 shrink-0" size={14} />
  };

  const colors = {
    log: "text-gray-700 dark:text-gray-300",
    warn: "text-yellow-600 dark:text-yellow-400 bg-yellow-500/5",
    error: "text-red-600 dark:text-red-400 bg-red-500/5",
    success: "text-green-600 dark:text-green-400 bg-green-500/5"
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className={`
        flex items-start gap-2 px-3 py-2 text-xs font-mono
        border-b border-gray-100 dark:border-gray-800
        hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer
        ${colors[log.type]}
      `}
      onClick={onClick}
    >
      <span className="text-gray-400 text-[10px] mt-0.5">
        {dayjs(log.timestamp).format("HH:mm:ss.SSS")}
      </span>
      {icons[log.type]}
      <span className="break-all">{log.text}</span>
    </motion.div>
  );
};

// Status bar component
const StatusBar = ({ 
  language, 
  lineCount, 
  cursorPosition, 
  isSaving, 
  encoding = "UTF-8",
  indentation = "Spaces: 2"
}) => (
  <div className="flex items-center justify-between px-3 py-1.5 bg-blue-600 text-white text-xs">
    <div className="flex items-center gap-4">
      <span className="flex items-center gap-1">
        <Command size={12} />
        <span>Ready</span>
      </span>
      {isSaving && (
        <motion.span 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-1"
        >
          <RotateCcw size={12} className="animate-spin" />
          Saving...
        </motion.span>
      )}
    </div>
    <div className="flex items-center gap-4">
      <span>{language}</span>
      <span>{encoding}</span>
      <span>{indentation}</span>
      <span>Ln {cursorPosition.line}, Col {cursorPosition.column}</span>
      <span>{lineCount} lines</span>
    </div>
  </div>
);

// Main Build Component
export default function Build() {
  const { theme, toggleTheme } = useTheme();
  const [html, setHtml] = useState(defaultHTML);
  const [css, setCss] = useState(defaultCSS);
  const [js, setJs] = useState(defaultJS);
  const [activeTab, setActiveTab] = useState("html");
  const [livePreview, setLivePreview] = useState(true);
  const [logs, setLogs] = useState([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [editorSettings, setEditorSettings] = useState({
    fontSize: 14,
    wordWrap: "on",
    minimap: false,
    lineNumbers: true,
    formatOnPaste: true
  });
  const [cursorPosition, setCursorPosition] = useState({ line: 1, column: 1 });
  const [isSaving, setIsSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  const iframeRef = useRef(null);
  const blobUrlRef = useRef(null);
  const editorRef = useRef(null);

  // Auto-save simulation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSaving(true);
      setTimeout(() => setIsSaving(false), 500);
    }, 1000);
    return () => clearTimeout(timer);
  }, [html, css, js]);

  // Build document with enhanced bridge
  const buildDocument = useCallback((html, css, js) => {
    const bridge = `
      <script>
      (function(){
        const originalConsole = {
          log: console.log,
          error: console.error,
          warn: console.warn
        };
        
        function send(type, args){
          try {
            const serialized = args.map(arg => {
              if (arg instanceof Error) return arg.toString();
              if (typeof arg === 'object') return JSON.stringify(arg, null, 2);
              return String(arg);
            });
            parent.postMessage({ 
              __bridge: true, 
              type, 
              args: serialized,
              timestamp: Date.now()
            }, "*");
          } catch(e) {
            parent.postMessage({ 
              __bridge: true, 
              type: 'error', 
              args: ['Serialization error: ' + e.message],
              timestamp: Date.now()
            }, "*");
          }
        }
        
        ["log","error","warn"].forEach(fn => {
          console[fn] = function(...args){
            send(fn, args);
            originalConsole[fn].apply(console, args);
          };
        });
        
        // Catch unhandled errors
        window.onerror = function(msg, url, line, col, error) {
          send('error', [msg + ' at line ' + line + ':' + col]);
          return false;
        };
        
        window.addEventListener('unhandledrejection', function(event) {
          send('error', ['Unhandled Promise Rejection: ' + event.reason]);
        });
      })();
      </script>
    `;

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>SwiftMeta Preview</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            primary: '#3b82f6',
            secondary: '#8b5cf6',
          },
        },
      },
    }
  </script>
  <style>
    ${css}
    /* Custom scrollbar for preview */
    ::-webkit-scrollbar { width: 8px; height: 8px; }
    ::-webkit-scrollbar-track { background: #f1f1f1; }
    ::-webkit-scrollbar-thumb { background: #888; border-radius: 4px; }
    ::-webkit-scrollbar-thumb:hover { background: #555; }
  </style>
</head>
<body class="bg-white text-gray-900 antialiased">
  ${html}
  <script>
    try {
      ${js}
    } catch (err) {
      console.error('Runtime Error:', err);
    }
  </script>
  ${bridge}
</body>
</html>`;
  }, []);

  // Run preview
  const runPreview = useCallback(() => {
    if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current);

    const htmlDoc = buildDocument(html, css, js);
    const blob = new Blob([htmlDoc], { type: "text/html" });
    const url = URL.createObjectURL(blob);

    blobUrlRef.current = url;
    if (iframeRef.current) {
      iframeRef.current.src = url;
    }
    
    notification.success({
      message: 'Preview Updated',
      description: 'Your changes have been rendered successfully.',
      placement: 'bottomRight',
      duration: 2,
    });
  }, [html, css, js, buildDocument]);

  // Auto-run on changes
  useEffect(() => {
    if (livePreview) {
      const timer = setTimeout(runPreview, 500);
      return () => clearTimeout(timer);
    }
  }, [html, css, js, livePreview, runPreview]);

  // Listen for console messages
  useEffect(() => {
    const handler = (e) => {
      if (!e.data?.__bridge) return;
      setLogs((prev) => [
        ...prev.slice(-99), // Keep last 100 logs
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

  // Keyboard shortcuts
  useKeyboardShortcuts({
    'ctrl+Enter': runPreview,
    'cmd+Enter': runPreview,
    'ctrl+s': () => downloadFile(),
    'cmd+s': () => downloadFile(),
    'ctrl+1': () => setActiveTab('html'),
    'ctrl+2': () => setActiveTab('css'),
    'ctrl+3': () => setActiveTab('js'),
  });

  // Download file
  const downloadFile = () => {
    const content = buildDocument(html, css, js);
    const blob = new Blob([content], { type: "text/html" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `swiftmeta-build-${dayjs().format('YYYY-MM-DD-HHmmss')}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    notification.success({
      message: 'File Downloaded',
      description: 'Your project has been saved successfully.',
    });
  };

  // Copy code
  const copyCode = () => {
    const code = { html, css, js }[activeTab];
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    notification.info({
      message: 'Copied to Clipboard',
      description: `${activeTab.toUpperCase()} code copied.`,
    });
  };

  // Clear logs
  const clearLogs = () => {
    setLogs([]);
    notification.info({
      message: 'Console Cleared',
      description: 'All logs have been cleared.',
    });
  };

  // Reset to defaults
  const resetCode = () => {
    setHtml(defaultHTML);
    setCss(defaultCSS);
    setJs(defaultJS);
    notification.warning({
      message: 'Code Reset',
      description: 'All editors have been reset to default.',
    });
  };

  // Editor configuration
  const getEditorOptions = useMemo(() => ({
    minimap: { enabled: editorSettings.minimap },
    scrollbar: { 
      vertical: "auto",
      horizontal: "auto",
      useShadows: true
    },
    wordWrap: editorSettings.wordWrap,
    fontSize: editorSettings.fontSize,
    lineHeight: 22,
    lineNumbers: editorSettings.lineNumbers ? "on" : "off",
    automaticLayout: true,
    padding: { top: 16, bottom: 16 },
    cursorBlinking: "smooth",
    cursorSmoothCaretAnimation: "on",
    scrollBeyondLastLine: false,
    smoothScrolling: true,
    occurrencesHighlight: true,
    selectionHighlight: true,
    overviewRulerBorder: false,
    quickSuggestions: {
      other: true,
      comments: true,
      strings: true,
    },
    suggestOnTriggerCharacters: true,
    formatOnPaste: editorSettings.formatOnPaste,
    formatOnType: true,
    tabSize: 2,
    insertSpaces: true,
    detectIndentation: true,
    folding: true,
    foldingStrategy: "indentation",
    showFoldingControls: "always",
    unfoldOnClickAfterEndOfLine: true,
    dragAndDrop: true,
    links: true,
    colorDecorators: true,
    lightbulb: { enabled: true },
  }), [editorSettings]);

  // Handle editor mount
  const handleEditorMount = (editor, monaco) => {
    editorRef.current = editor;
    
    // Add custom commands
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      downloadFile();
    });
    
    // Track cursor position
    editor.onDidChangeCursorPosition((e) => {
      setCursorPosition({
        line: e.position.lineNumber,
        column: e.position.column
      });
    });
  };

  // Calculate line counts
  const lineCounts = useMemo(() => ({
    html: html.split('\n').length,
    css: css.split('\n').length,
    js: js.split('\n').length
  }), [html, css, js]);

  return (
    <>
      <Helmet>
        <title>Build | SwiftMeta Code Editor</title>
        <meta name="description" content="Professional web development playground with live preview." />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className={`min-h-screen bg-[#f3f4f6] dark:bg-[#0d1117] flex flex-col ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
        
        {/* Header */}
        <header className="bg-white dark:bg-[#161b22] border-b border-gray-200 dark:border-gray-800 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <Code2 className="text-white" size={18} />
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                    SwiftMeta <span className="text-blue-500">Builder</span>
                  </h1>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    HTML · CSS · Tailwind · JavaScript
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Tooltip title="Toggle Theme">
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400"
                >
                  {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                </button>
              </Tooltip>

              <Tooltip title="Editor Settings">
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className={`p-2 rounded-lg transition-colors ${showSettings ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600' : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400'}`}
                >
                  <Settings size={18} />
                </button>
              </Tooltip>

              <Tooltip title="Reset Code">
                <button
                  onClick={resetCode}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400"
                >
                  <RotateCcw size={18} />
                </button>
              </Tooltip>

              <div className="h-6 w-px bg-gray-200 dark:border-gray-700 mx-1" />

              <Tooltip title={livePreview ? "Live Preview On" : "Live Preview Off"}>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800">
                  <div className={`w-2 h-2 rounded-full ${livePreview ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
                  <span className="text-xs text-gray-600 dark:text-gray-400">Live</span>
                  <Switch 
                    size="small" 
                    checked={livePreview}
                    onChange={setLivePreview}
                  />
                </div>
              </Tooltip>

              <Tooltip title="Run (Ctrl+Enter)">
                <Button
                  type="primary"
                  icon={<Play size={16} />}
                  onClick={runPreview}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Run
                </Button>
              </Tooltip>

              <Tooltip title="Download">
                <Button
                  icon={<Download size={16} />}
                  onClick={downloadFile}
                >
                  Export
                </Button>
              </Tooltip>

              <Tooltip title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}>
                <button
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400"
                >
                  {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                </button>
              </Tooltip>
            </div>
          </div>
        </header>

        {/* Settings Panel */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-gray-50 dark:bg-[#0d1117] border-b border-gray-200 dark:border-gray-800 px-4 py-3 overflow-hidden"
            >
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Type size={16} className="text-gray-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Font Size:</span>
                  <Select
                    value={editorSettings.fontSize}
                    onChange={(val) => setEditorSettings(s => ({ ...s, fontSize: val }))}
                    options={[12, 14, 16, 18, 20].map(s => ({ value: s, label: `${s}px` }))}
                    size="small"
                    style={{ width: 80 }}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Layout size={16} className="text-gray-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Word Wrap:</span>
                  <Select
                    value={editorSettings.wordWrap}
                    onChange={(val) => setEditorSettings(s => ({ ...s, wordWrap: val }))}
                    options={[
                      { value: 'on', label: 'On' },
                      { value: 'off', label: 'Off' },
                      { value: 'wordWrapColumn', label: 'Column' }
                    ]}
                    size="small"
                    style={{ width: 100 }}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Minimap:</span>
                  <Switch
                    size="small"
                    checked={editorSettings.minimap}
                    onChange={(val) => setEditorSettings(s => ({ ...s, minimap: val }))}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Line Numbers:</span>
                  <Switch
                    size="small"
                    checked={editorSettings.lineNumbers}
                    onChange={(val) => setEditorSettings(s => ({ ...s, lineNumbers: val }))}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Editor Section */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Tabs */}
            <div className="flex bg-gray-100 dark:bg-[#252526]">
              <EditorTab
                id="html"
                label="index.html"
                icon={FileCode}
                active={activeTab === 'html'}
                onClick={() => setActiveTab('html')}
                hasChanges={html !== defaultHTML}
              />
              <EditorTab
                id="css"
                label="style.css"
                icon={Palette}
                active={activeTab === 'css'}
                onClick={() => setActiveTab('css')}
                hasChanges={css !== defaultCSS}
              />
              <EditorTab
                id="js"
                label="script.js"
                icon={Code2}
                active={activeTab === 'js'}
                onClick={() => setActiveTab('js')}
                hasChanges={js !== defaultJS}
              />
              
              <div className="flex-1" />
              
              <Tooltip title="Copy Code">
                <button
                  onClick={copyCode}
                  className="px-3 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
                >
                  {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                </button>
              </Tooltip>
            </div>

            {/* Editor */}
            <div className="flex-1 relative">
              <Editor
                height="100%"
                language={activeTab}
                theme={theme === 'dark' ? 'vs-dark' : 'vs-light'}
                value={{ html, css, js }[activeTab]}
                onChange={(value) => {
                  const setter = { html: setHtml, css: setCss, js: setJs }[activeTab];
                  setter(value || '');
                }}
                options={getEditorOptions}
                onMount={handleEditorMount}
              />
            </div>

            {/* Status Bar */}
            <StatusBar
              language={activeTab.toUpperCase()}
              lineCount={lineCounts[activeTab]}
              cursorPosition={cursorPosition}
              isSaving={isSaving}
            />
          </div>

          {/* Preview Section */}
          <div className="w-1/2 min-w-0 border-l border-gray-200 dark:border-gray-800 flex flex-col bg-white dark:bg-[#0d1117]">
            {/* Preview Header */}
            <div className="flex items-center justify-between px-4 py-2 bg-gray-50 dark:bg-[#161b22] border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-2">
                <Eye size={16} className="text-gray-500" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Live Preview</span>
                {livePreview && (
                  <Badge status="processing" text="Auto" className="ml-2" />
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">{blobUrlRef.current ? 'Ready' : 'Loading...'}</span>
              </div>
            </div>

            {/* Preview Frame */}
            <div className="flex-1 relative">
              <iframe
                ref={iframeRef}
                className="w-full h-full border-0"
                sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                title="Preview"
              />
            </div>

            {/* Console */}
            <div className="h-48 border-t border-gray-200 dark:border-gray-800 flex flex-col bg-white dark:bg-[#161b22]">
              <div className="flex items-center justify-between px-4 py-2 bg-gray-50 dark:bg-[#252526] border-b border-gray-200 dark:border-gray-800">
                <div className="flex items-center gap-2">
                  <Terminal size={14} className="text-gray-500" />
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Console</span>
                  {logs.length > 0 && (
                    <Badge count={logs.length} className="ml-2" style={{ backgroundColor: '#3b82f6' }} />
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={clearLogs}
                    className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 px-2 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                  >
                    Clear
                  </button>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto font-mono text-xs">
                {logs.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    <span className="italic">console.log("Hello, World!");</span>
                  </div>
                ) : (
                  logs.map((log) => (
                    <LogItem key={log.id} log={log} />
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Keyboard Shortcuts Footer */}
        <div className="bg-gray-100 dark:bg-[#161b22] border-t border-gray-200 dark:border-gray-800 px-4 py-2">
          <div className="flex items-center justify-center gap-6 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-600 font-sans">Ctrl</kbd>
              <span>+</span>
              <kbd className="px-1.5 py-0.5 bg-white dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-600 font-sans">Enter</kbd>
              <span className="ml-1">Run</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-600 font-sans">Ctrl</kbd>
              <span>+</span>
              <kbd className="px-1.5 py-0.5 bg-white dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-600 font-sans">S</kbd>
              <span className="ml-1">Download</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-600 font-sans">Ctrl</kbd>
              <span>+</span>
              <kbd className="px-1.5 py-0.5 bg-white dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-600 font-sans">1/2/3</kbd>
              <span className="ml-1">Switch Tab</span>
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
