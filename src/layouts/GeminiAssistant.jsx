import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Modal, Input, Button, Spin } from "antd";
import { MessageCircle, Send, X } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const { TextArea } = Input;

const GeminiAssistant = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState([]);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages, loading]);

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
      {/* Floating Button */}
      <Button
  type="primary"
  shape="circle"
  size="large"
  icon={<MessageCircle size={28} />}
  className="fixed bottom-4 right-4 z-50 shadow-2xl hover:scale-110 transition-transform duration-200"
  onClick={() => setOpen(true)}
/>


      {/* AntD Modal - Bottom Right */}
      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        closeIcon={<X size={20} />}
        width={420}
        style={{ top: 20, right: 23, position: "fixed", margin: 0, paddingBottom: 0 }}
        bodyStyle={{ height: "560px", padding: "16px", display: "flex", flexDirection: "column" }}
        title={<span className="font-bold text-blue-600">SwiftMeta AI Assistant</span>}
      >
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto pr-2 space-y-4">
          {messages.length === 0 && (
            <div className="text-center text-gray-500 mt-10">Ask me anything!</div>
          )}
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-sm ${
                  m.sender === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                }`}
              >
                <ReactMarkdown remarkPlugins={[remarkGfm]} className="prose prose-sm max-w-none dark:prose-invert">
                  {m.sender === "ai" ? m.text.replace(/\*\*/g, "**") : m.text}
                </ReactMarkdown>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl px-4 py-3">
                <Spin size="small" /> Thinking...
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input Area */}
        <div className="flex gap-2 mt-4 border-t pt-4">
          <TextArea
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            placeholder="Type your message..."
            autoSize={{ minRows: 1, maxRows: 4 }}
            onPressEnter={(e) => !e.shiftKey && (e.preventDefault(), sendMessage())}
          />
          <Button
            type="primary"
            shape="circle"
            icon={<Send size={18} />}
            onClick={sendMessage}
            loading={loading}
            size="large"
          />
        </div>
      </Modal>
    </>
  );
};

export default GeminiAssistant;
