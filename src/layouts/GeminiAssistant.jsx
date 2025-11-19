import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Modal, Input, Button, Spin, Tooltip } from "antd";
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
      {/* Floating Chat Button */}
      {!open && (
        <Tooltip title="Chat with SwiftMeta AI">
          <Button
            type="primary"
            shape="circle"
            size="large"
            icon={<MessageCircle size={28} />}
            className="fixed bottom-0 right-[40%] z-50 shadow-2xl hover:scale-110 transition-transform duration-200"
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
        width={400}
        style={{ top: 20, right: 23, position: "fixed", margin: 0, paddingBottom: 0 }}
        bodyStyle={{ height: "600px", padding: "16px", display: "flex", flexDirection: "column", backgroundColor: "#f7f7f8" }}
        title={
          <div className="flex justify-between items-center">
            <span className="font-bold text-blue-600 text-lg">SwiftMeta AI</span>
            <Button type="text" icon={<X />} onClick={() => setOpen(false)} />
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
          setTimeout(() => sendMessage(), 100); // slight delay to update input
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
                className={`max-w-[80%] rounded-2xl px-4 py-3 shadow ${
                  m.sender === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700"
                }`}
              >
                <ReactMarkdown remarkPlugins={[remarkGfm]} className="prose prose-sm max-w-none dark:prose-invert break-words">
                  {m.text}
                </ReactMarkdown>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-white dark:bg-gray-800 rounded-2xl px-4 py-2 shadow-sm flex items-center gap-2">
                <Spin size="small" />
                <span className="text-gray-500 dark:text-gray-300 text-sm">Thinking...</span>
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
            placeholder="Type your message..."
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
