import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Modal, Input, Button, Spin, Tooltip } from "antd";
import { MessageCircle, Send, X } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coldarkCold } from "react-syntax-highlighter/dist/esm/styles/prism";
import { toast} from "react-hot-toast";
const { TextArea } = Input;

const GeminiAssistant = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState([]);
  const chatEndRef = useRef(null);


  const Loader = () => (
  <div className="flex flex-col items-center justify-center bg-transparent">
    <svg
      width="30"
      height="30"
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      className="animate-spin text-gray-300 dark:text-gray-700"
    >
      <circle
        cx="50"
        cy="50"
        r="40"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
        fill="none"
        strokeDasharray="250"
        strokeDashoffset="190"
      />
      <circle cx="50" cy="50" r="10" fill="#00E5FF">
        <animate
          attributeName="r"
          values="10;14;10"
          dur="1.6s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="opacity"
          values="1;0.6;1"
          dur="1.6s"
          repeatCount="indefinite"
        />
      </circle>
    </svg>

  </div>
);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages, loading]);


const useConnectionStrength = () => {
  const [strength, setStrength] = useState("Checking...");

  useEffect(() => {
    const conn =
      navigator.connection ||
      navigator.webkitConnection ||
      navigator.mozConnection;

    if (!conn) {
      setStrength("Unknown");
      return;
    }

    const evaluate = () => {
      const speed = conn.downlink; // Mbps
      const type = conn.effectiveType; // 4g, 3g, etc.

      let level = "Good";

      if (speed < 1 || type === "2g" || type === "slow-2g") level = "Poor";
      else if (speed < 3 || type === "3g") level = "Average";

      setStrength(level);

      if (level === "Poor") {
        toast.error("Your connection is weak. AI responses may be slow.", {
          duration: 4000,
        });
      }
      if (level === "Good") {
        toast.success("Connection strength: Good", { duration: 2000 });
      }
    };

    evaluate();
    conn.addEventListener("change", evaluate);

    return () => conn.removeEventListener("change", evaluate);
  }, []);

  return strength;
};

 const connectionStrength = useConnectionStrength();
  
  const sendMessage = async () => {
    if (!msg.trim()) return;

    const userMsg = { sender: "user", text: msg };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);
    setMsg("");

    try {
      const res = await axios.post("https://swiftmeta.onrender.com/api/gemini", { prompt: msg });
      const aiMsg = { sender: "ai", text: res.data.reply };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      setMessages((prev) => [...prev, { sender: "ai", text: "Oops! Something went wrong." }]);
    }
    setLoading(false);
  };

  return (
    <>
      {/* Floating Chat Button */}
      {!open && (
        <Tooltip title="Chat with SwiftMeta AI">
          <Button
            type="primary"
            shape="circle"
            size="large"
            icon={<MessageCircle size={28} />}
            className="flex top-0 right-[-2%] z-20 shadow-2xl hover:scale-110 transition-transform duration-200"
            onClick={() => setOpen(true)}
          />
        </Tooltip>
      )}

      {/* Chat Modal */}
      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        closeIcon={<X size={20} />}
        width={700}
        style={{ top: 20, right: 12, position: "fixed", margin: 0, paddingBottom: 0 }}
        bodyStyle={{ height: "600px", padding: "16px", display: "flex", flexDirection: "column" }}
        title={
  <div className="flex flex-col gap-1">
    <div className="flex justify-between items-center">
      <span className="text-blue-300 text-sm">SwiftMeta AI-Powered</span>
      <Button type="text" icon={<X />} onClick={() => setOpen(false)} />
    </div>

    {/* Connection Strength Display */}
    <div
      className={`text-xs font-semibold ${
        connectionStrength === "Good"
          ? "text-green-500"
          : connectionStrength === "Average"
          ? "text-yellow-500"
          : "text-red-500"
      }`}
    >
      Connection: {connectionStrength}
    </div>
  </div>
}

        className="rounded-xl overflow-hidden"
      >
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto pr-2 space-y-3">
          
{messages.length === 0 && (
  <div className="grid grid-cols-2 gap-3 mt-6 px-2">
    {[
      "Explain React hooks",
      "Generate a website idea",
      "Write a Python snippet",
      "Tips for learning AI"
    ].map((prompt, idx) => (
      <div
        key={idx}
        onClick={() => {
          setMsg(prompt);
          setTimeout(() => sendMessage(), 300); // slight delay to update input
        }}
        className="cursor-pointer bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow hover:shadow-lg transition hover:bg-blue-50 dark:hover:bg-gray-700"
      >
        <p className="text-gray-700 dark:text-gray-100 font-medium text-sm text-center">{prompt}</p>
      </div>
    ))}
  </div>
)}


          
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[100%] rounded-2xl px-4 py-3 shadow ${
                  m.sender === "user"
                    ? "bg-blue-300 text-white"
                    : "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700"
                }`}
              >
                <ReactMarkdown
  remarkPlugins={[remarkGfm]}
  className="prose prose-sm max-w-none dark:prose-invert break-words"
  components={{
    code({ inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || "");

      return !inline && match ? (
        <SyntaxHighlighter
          style={coldarkCold}
          language={match[1]}
          PreTag="div"
          customStyle={{
            borderRadius: "10px",
            padding: "18px",
            fontSize: "0.85rem",
          }}
          {...props}
        >
          {String(children).replace(/\n$/, "")}
        </SyntaxHighlighter>
      ) : (
        <code className="bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 rounded text-sm" {...props}>
          {children}
        </code>
      );
    },
  }}
>
  {m.text}
</ReactMarkdown>

              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start animation-fade">
              <div className="bg-white dark:bg-gray-800 rounded-2xl px-4 py-2 shadow-sm flex items-center gap-2">
                <Loader />
                <span className="text-gray-500 dark:text-gray-300 text-sm animation-pulse">Thinking...</span>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input Area */}
        <div className="flex gap-2 mt-4 pt-4">
          <TextArea
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            placeholder="Ask anything"
            autoSize={{ minRows: 3, maxRows: 5 }}
            onPressEnter={(e) => !e.shiftKey && (e.preventDefault(), sendMessage())}
            className="rounded-lg border-gray-300 dark:border-gray-700"
          />
          <Tooltip title="Send Message">
            <Button
              type="primary"
              shape="circle"
              icon={<Send size={18} />}
              onClick={sendMessage}
              loading={loading}
              size="large"
            />
          </Tooltip>
        </div>
      </Modal>
      
    </>
  );
};

export default GeminiAssistant;
