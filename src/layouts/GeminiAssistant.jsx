import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { MessageCircle, Send, X } from "lucide-react";
import { Input, Button, Tooltip, Spin, Typography } from "antd";
import { toast, Toaster } from "react-hot-toast";

const { TextArea } = Input;
const { Text } = Typography;

const GeminiAssistant = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState([]);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!msg.trim()) return toast.error("Please enter a message!");

    const userMsg = { sender: "user", text: msg };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);
    setMsg("");

    try {
      const res = await axios.post("/api/gemini", { prompt: msg });

      const aiMsg = { sender: "ai", text: res.data.reply };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
      toast.error("AI request failed!");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />

      {/* Floating Button */}
      {!open && (
        <Tooltip title="Open SwiftMeta Assistant" placement="left">
          <Button
            type="primary"
            shape="circle"
            size="large"
            icon={<MessageCircle />}
            className="fixed bottom-6 right-6 shadow-lg"
            onClick={() => setOpen(true)}
          />
        </Tooltip>
      )}

      {/* Chat Window */}
      {open && (
        <div className="fixed bottom-6 right-6 w-96 bg-white dark:bg-gray-900 shadow-2xl rounded-xl border dark:border-gray-700 flex flex-col h-[24rem]">
          {/* Header */}
          <div className="flex justify-between items-center px-4 py-2 border-b dark:border-gray-700">
            <Text strong className="text-blue-600">
              SwiftMeta Assistant
            </Text>
            <Button
              type="text"
              icon={<X />}
              onClick={() => setOpen(false)}
            />
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`p-2 rounded-lg max-w-[80%] break-words ${
                  m.sender === "user"
                    ? "bg-blue-600 text-white ml-auto"
                    : "bg-gray-100 dark:bg-gray-700 text-black dark:text-white"
                }`}
              >
                {m.text}
              </div>
            ))}

            {loading && (
              <div className="flex justify-start items-center space-x-2 text-gray-500">
                <Spin size="small" />
                <Text type="secondary">Thinking...</Text>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          <div className="px-4 py-3 border-t dark:border-gray-700 flex gap-2 items-end">
            <TextArea
              autoSize={{ minRows: 1, maxRows: 4 }}
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything..."
              className="dark:bg-gray-800 dark:text-white rounded-md"
            />
            <Tooltip title="Send Message">
              <Button
                type="primary"
                icon={<Send />}
                onClick={sendMessage}
                loading={loading}
              />
            </Tooltip>
          </div>
        </div>
      )}
    </>
  );
};

export default GeminiAssistant;
