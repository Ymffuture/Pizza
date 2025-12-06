import React, { useState, useEffect } from "react";
import { Modal, Input, Button, Spin } from "antd";
import { api } from "../api";
import toast from "react-hot-toast";

const { TextArea } = Input;

export default function EditPostModal({ postId, visible, onClose, onUpdated }) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [images, setImages] = useState([]);

  useEffect(() => {
    if (visible) loadPost();
  }, [visible]);

  async function loadPost() {
    setLoading(true);
    try {
      const r = await api.get(`/posts/${postId}`);
      setTitle(r.data.title);
      setBody(r.data.body);
      setImages(r.data.images || []);
    } catch (e) {
      toast.error("Failed to load post");
      onClose();
    } finally {
      setLoading(false);
    }
  }

  async function save() {
    setSaving(true);
    try {
      await api.put(`/posts/${postId}`, { title, body, images });
      toast.success("Post updated");
      onUpdated();
      onClose();
    } catch (e) {
      toast.error("Failed to update");
    } finally {
      setSaving(false);
    }
  }
  
const Loader = () => (
  <div className="flex flex-col items-center justify-center bg-transparent">
    <svg
      width="50"
      height="50"
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
    <p className="text-gray-500 dark:text-gray-400 mt-3 text-sm tracking-wide animate-fadeIn">
      Loading ...
    </p>
  </div>
);
  return (
    <Modal
      title="Edit Post"
      open={visible}
      destroyOnClose
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button
          key="save"
          type="primary"
          loading={saving}
          onClick={save}
        >
          Save Changes
        </Button>,
      ]}
    >
      {loading ? (
        <div className="text-center py-10">
          <Loader/>
        </div>
      ) : (
        <div className="space-y-4">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
          />
          <TextArea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Write something..."
            rows={6}
          />
        </div>
      )}
    </Modal>
  );
}
