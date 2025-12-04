import React, { useState, useEffect } from "react";
import { api } from "../api";
import toast from "react-hot-toast";
import CommentRow from "./CommentRow";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { Card, Button, Tabs, Upload, Input } from "antd";
import { FiImage, FiSend } from "react-icons/fi";

const { TextArea } = Input;

export default function CommentBox({ postId, onCommentUpdate }) {
  const [text, setText] = useState("");
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadComments();
  }, []);

  async function loadComments() {
    try {
      const r = await api.get(`/posts/${postId}`);
      setComments(r.data.comments || []);
      onCommentUpdate(postId, r.data.comments || []);
    } catch {
      toast.error("Failed to load comments");
    } finally {
      setLoading(false);
    }
  }

  async function uploadImage(file) {
    const fd = new FormData();
    fd.append("file", file);

    try {
      const r = await api.post("/upload", fd);
      return r.data.url;
    } catch {
      toast.error("Image upload failed");
      return null;
    }
  }

  async function submitComment() {
    if (!text.trim()) return toast.error("Write something");

    try {
      const r = await api.post(`/posts/${postId}/comments`, {
        text,
        plainText: text,
      });

      setComments(prev => [...prev, r.data]);
      onCommentUpdate(postId, [...comments, r.data]);
      setText("");
      toast.success("Comment posted");
    } catch {
      toast.error("Failed to post comment");
    }
  }

  const tabs = [
    {
      key: "1",
      label: "Write",
      children: (
        <TextArea
          value={text}
          onChange={e => setText(e.target.value)}
          autoSize={{ minRows: 4 }}
          placeholder="Write something..."
        />
      ),
    },
    {
      key: "2",
      label: "Preview",
      children: (
        <Card className="prose max-w-none p-3 bg-gray-50 rounded-xl">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {text || "*Nothing to preview...*"}
          </ReactMarkdown>
        </Card>
      ),
    },
  ];

  return (
    <div className="space-y-4">

      {/* INPUT CARD (Telegram style) */}
      <Card bordered className="rounded-2xl shadow-sm border-gray-200">

        {/* TABS */}
        <Tabs items={tabs} />

        {/* ACTION BAR */}
        <div className="flex items-center gap-3 mt-3 bg-gray-100 p-2 rounded-xl">

          {/* IMAGE UPLOAD */}
          <Upload
            showUploadList={false}
            beforeUpload={async file => {
              const url = await uploadImage(file);
              if (url) {
                setText(prev => prev + `\n![](${url})`);
              }
              return false;
            }}
          >
            <Button
              icon={<FiImage />}
              className="rounded-full shadow-sm"
            />
          </Upload>

          {/* SEND BUTTON */}
          <Button
            type="primary"
            icon={<FiSend />}
            onClick={submitComment}
            className="ml-auto rounded-full px-6 shadow-md"
          >
            Send
          </Button>
        </div>

      </Card>

      {/* COMMENT LIST */}
      <div className="space-y-3">
        {comments.map(c => (
          <CommentRow
            key={c._id}
            comment={c}
            postId={postId}
            onUpdate={loadComments}
          />
        ))}
      </div>
    </div>
  );
}
