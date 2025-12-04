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
      onUpdated(); // Callback for parent to refresh list
      onClose();
    } catch (e) {
      toast.error("Failed to update");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal
      title="Edit Post"
      open={visible}
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
          <Spin size="large" />
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
