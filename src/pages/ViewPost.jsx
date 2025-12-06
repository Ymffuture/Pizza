import React, { useEffect, useState } from "react";
import { Modal, Input, Button, Spin } from "antd";
import { api } from "../api";
import toast from "react-hot-toast";

const { TextArea } = Input;

export default function ViewPostModal({ postId, visible, onClose }) {
  const [post, setPost] = useState(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [commenting, setCommenting] = useState(false);

  useEffect(() => {
    if (visible) loadPost();
  }, [visible]);

  async function loadPost() {
    if (!postId) return;
    setLoading(true);

    try {
      const r = await api.get(`/posts/${postId}`);
      setPost(r.data);
    } catch {
      toast.error("Failed to load post");
      onClose();
    } finally {
      setLoading(false);
    }
  }

  async function sendComment() {
    if (!text.trim()) return;
    setCommenting(true);

    try {
      const r = await api.post(`/posts/${postId}/comments`, { text });

      setPost(prev => ({
        ...prev,
        comments: [...(prev?.comments || []), r.data]
      }));

      setText("");
    } catch {
      toast.error("Failed to comment");
    } finally {
      setCommenting(false);
    }
  }

  return (
    <Modal
      title={post?.title || "Post"}
      open={visible}
      onCancel={onClose}
      footer={null}
      width={600}
      centered
    >
      {loading ? (
        <div className="text-center py-10">
          <Spin size="large" />
        </div>
      ) : (
        <>
          {/* POST BODY */}
          <p className="mb-4 opacity-80 whitespace-pre-line">
            {post.body}
          </p>

          {/* POST IMAGES */}
          {Array.isArray(post.images) && post.images.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-5">
              {post.images.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  className="w-full rounded-xl object-cover min-h-[150px]"
                  onError={e => (e.currentTarget.src = "https://swiftmeta.vercel.app/err.jpg")}
                  alt="post media"
                />
              ))}
            </div>
          )}

          <hr className="my-4" />

          {/* COMMENTS */}
          <h3 className="text-lg font-bold mb-2">Comments</h3>

          {/* COMMENT INPUT */}
          <div className="flex items-center gap-2 mb-3">
            <Input
              placeholder="Write a comment..."
              value={text}
              onChange={e => setText(e.target.value)}
              disabled={commenting}
              allowClear
            />
            <Button
              type="primary"
              onClick={sendComment}
              loading={commenting}
              disabled={!text.trim()}
            >
              Send
            </Button>
          </div>

          {/* COMMENT LIST */}
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {(post.comments || []).map(c => (
              <div key={c._id} className="flex gap-2 items-start">
                <img
                  src={c.author?.avatar || "https://swiftmeta.vercel.app/pp.jpeg"}
                  className="w-8 h-8 rounded-full object-cover border border-gray-300 dark:border-gray-700"
                  onError={e => (e.currentTarget.src = "https://swiftmeta.vercel.app/err.jpg")}
                  alt="avatar"
                />
                <div className="bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded-xl text-sm">
                  <b className="block text-[12px]">{c.author?.name || "User"}</b>
                  <p>{c.text}</p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </Modal>
  );
}
