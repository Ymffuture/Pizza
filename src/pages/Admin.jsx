import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import { Spin, Modal } from "antd";
import {
  User,
  Mail,
  Trash2,
  CheckCircle,
  Clock
} from "lucide-react";
import { api } from "../api";

const LIMIT = 4;

export default function AdminContacts() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [skip, setSkip] = useState(0);
  const [selected, setSelected] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchContacts = async (reset = false) => {
    try {
      setLoading(true);
      const { data } = await api.get(`/contact?skip=${reset ? 0 : skip}&limit=${LIMIT}`);
      if (reset) {
        setContacts(data);
        setSkip(LIMIT);
      } else {
        setContacts(prev => [...prev, ...data]);
        setSkip(prev => prev + LIMIT);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts(true);
  }, []);

  const updateStatus = async (id, status) => {
  try {
    setActionLoading(true);

    await api.put(`/contact/${id}/status`, { status });

    setContacts(prev =>
      prev.map(c => (c._id === id ? { ...c, status } : c))
    );
  } finally {
    setActionLoading(false);
  }
};


  const deleteContact = async id => {
    Modal.confirm({
      title: "Delete message?",
      content: "This action cannot be undone.",
      okType: "danger",
      onOk: async () => {
        await api.delete(`/contact/${id}`);
        setContacts(prev => prev.filter(c => c._id !== id));
      },
    });
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-100 to-white dark:from-black dark:to-gray-900 p-8 mt-16">
      <Helmet>
        <title>Admin · Contact Messages</title>
      </Helmet>

      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-4xl font-extrabold text-center mb-10 
        bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600
        drop-shadow-[0_0_25px_rgba(99,102,241,0.35)]"
      >
        Contact Messages
      </motion.h1>

      <div className="max-w-5xl mx-auto space-y-4">
        {loading && skip === 0 ? (
          <div className="flex justify-center py-20">
            <Spin size="large" />
          </div>
        ) : (
          contacts.map(contact => (
            <motion.div
              key={contact._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between p-5 rounded-2xl 
              bg-white dark:bg-[#111] shadow border border-black/5 dark:border-white/10"
            >
              <div
                className="flex items-center gap-4 cursor-pointer"
                onClick={() => setSelected(contact)}
              >
                <StatusDot status={contact.status} />

                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {contact.name}
                  </p>
                  <p className="text-xs text-gray-500">{contact.subject || "No subject"}</p>
                </div>
              </div>

              <div className="flex gap-3">
                {contact.status === "pending" && (
                  <button
                    onClick={() => updateStatus(contact._id, "approved")}
                    className="p-2 rounded-xl bg-green-500/10 text-green-600 hover:bg-green-500/20"
                  >
                    <CheckCircle size={18} />
                  </button>
                )}
                <button
                  onClick={() => deleteContact(contact._id)}
                  className="p-2 rounded-xl bg-red-500/10 text-red-600 hover:bg-red-500/20"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </motion.div>
          ))
        )}

        {contacts.length % LIMIT === 0 && contacts.length > 0 && (
          <div className="flex justify-center pt-6">
            <button
              onClick={() => fetchContacts(false)}
              className="px-6 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? <Spin size="small" /> : "Load More"}
            </button>
          </div>
        )}
      </div>

      {/* READ MESSAGE MODAL */}
      <Modal
        open={!!selected}
        onCancel={() => setSelected(null)}
        footer={null}
        title="Message"
      >
        {selected && (
          <div className="space-y-3">
            <p><strong>Name:</strong> {selected.name}</p>
            <p><strong>Email:</strong> {selected.email}</p>
            <p><strong>Subject:</strong> {selected.subject || "-"}</p>
            <p className="text-gray-700 dark:text-gray-300">
              {selected.message}
            </p>
          </div>
        )}
      </Modal>
    </main>
  );
}

/* -------------------------
   Status Dot
-------------------------- */
function StatusDot({ status }) {
  return (
    <span
      className={`w-3 h-3 rounded-full ${
        status === "pending"
          ? "bg-yellow-400 animate-pulse"
          : "bg-green-500"
      }`}
    />
  );
}
