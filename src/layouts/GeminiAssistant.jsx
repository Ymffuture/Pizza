import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Tooltip, Button, Input, Spin, Card } from "antd";
import { MessageCircle, Send, X } from "lucide-react";

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
      console.error(err);
      const errorMsg = { sender: "ai", text: "Oops! Something went wrong." };
      setMessages((prev) => [...prev, errorMsg]);
    }

    setLoading(false);
  };

  return (
    <>
      {/* Floating Button */}
      {!open && (
        <Tooltip title="Chat with SwiftMeta AI">
          <Button
            type="primary"
            shape="circle"
            size="large"
            className="fixed bottom-6 right-6 z-50 shadow-lg flex items-center justify-center"
            onClick={() => setOpen(true)}
          >
            <MessageCircle size={24} />
          </Button>
        </Tooltip>
      )}

      {/* Chat Window */}
      {open && (
        <Card
          className="fixed bottom-6 right-6 w-96 h-[480px] flex flex-col z-50 shadow-xl rounded-xl overflow-hidden"
          bodyStyle={{ padding: "12px", display: "flex", flexDirection: "column", height: "100%" }}
          title={
            <div className="flex justify-between items-center">
              <span className="text-blue-500 font-bold">SwiftMeta Assistant</span>
              <Button
                type="text"
                icon={<X />}
                onClick={() => setOpen(false)}
              />
            </div>
          }
        >
          <div className="flex-1 overflow-y-auto space-y-3 mb-3 px-1">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`p-3 rounded-lg max-w-[80%] break-words ${
                  m.sender === "user"
                    ? "bg-blue-500 text-white ml-auto"
                    : "bg-gray-100 dark:bg-gray-700 text-black dark:text-white"
                }`}
              >
                {m.text}
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <Spin size="small" tip="Thinking..." />
              </div>
            )}
            <div ref={chatEndRef}></div>
          </div>

          <div className="flex gap-2">
            <TextArea
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              placeholder="Ask me anything..."
              autoSize={{ minRows: 1, maxRows: 4 }}
              onPressEnter={(e) => {
                if (!e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
            />
            <Tooltip title="Send">
              <Button
                type="primary"
                icon={<Send size={18} />}
                onClick={sendMessage}
                loading={loading}
              />
            </Tooltip>
          </div>
        </Card>
      )}
    </>
  );
};

export default GeminiAssistant;
