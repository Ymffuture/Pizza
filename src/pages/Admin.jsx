import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import {
  Spin,
  Modal,
  Tooltip,
  message,
} from "antd";
import {
  Trash2,
  CheckCircle,
  Clock,
  Printer,
  Copy,
} from "lucide-react";
import { api } from "../api";

const LIMIT = 4;

export default function AdminContacts() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [skip, setSkip] = useState(0);
  const [selected, setSelected] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  /* ======================
     FETCH CONTACTS
  ====================== */
  const fetchContacts = async (reset = false) => {
    try {
      setLoading(true);

      const { data } = await api.get(
        `/contact?skip=${reset ? 0 : skip}&limit=${LIMIT}`
      );

      if (reset) {
        setContacts(data);
        setSkip(LIMIT);
      } else {
        setContacts(prev => [...prev, ...data]);
        setSkip(prev => prev + LIMIT);
      }
    } catch {
      message.error("Failed to load contacts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts(true);
  }, []);

  /* ======================
     UPDATE STATUS
  ====================== */
  const updateStatus = async (id, status) => {
    try {
      setActionLoading(true);

      await api.put(`/contact/${id}/status`, { status });

      setContacts(prev =>
        prev.map(c =>
          c._id === id ? { ...c, status } : c
        )
      );

      if (status === "approved") {
        message.success("Message approved");
      }
    } catch {
      message.error("Failed to update status");
    } finally {
      setActionLoading(false);
    }
  };

  /* ======================
     DELETE CONTACT
  ====================== */
  const deleteContact = id => {
    Modal.confirm({
      title: "Delete message?",
      content: "This action cannot be undone.",
      okType: "danger",
      okText: "Delete",
      cancelText: "Cancel",

      async onOk() {
        try {
          setActionLoading(true);

          await api.delete(`/contact/${id}`);

          setContacts(prev =>
            prev.filter(c => c._id !== id)
          );

          message.success("Message deleted");
        } catch (err) {
          message.error(
            err?.response?.data?.error ||
              "Delete failed"
          );
          throw err;
        } finally {
          setActionLoading(false);
        }
      },
    });
  };

  /* ======================
     COPY CONTACT INFO
  ====================== */
  const copyInfo = contact => {
    const text = `
Name: ${contact.name}
Email: ${contact.email}
Subject: ${contact.subject || "-"}
Message: ${contact.message}
    `.trim();

    navigator.clipboard.writeText(text);
    message.success("Copied to clipboard");
  };

  /* ======================
     PRINT
  ====================== */
  const printMessage = () => {
    window.print();
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-100 to-white p-8 mt-16">
      <Helmet>
        <title>Admin · Contact Messages</title>
      </Helmet>

      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-4xl font-extrabold text-center mb-10"
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
              className="flex items-center justify-between p-5 rounded-xl bg-white shadow"
            >
              <div
                className="flex items-center gap-4 cursor-pointer"
                onClick={() => setSelected(contact)}
              >
                <StatusDot status={contact.status} />

                <div>
                  <p className="font-semibold">
                    {contact.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {contact.subject || "No subject"}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                {contact.status === "pending" ? (
                  <Tooltip title="Pending · Click to copy details">
                    <button
                      onClick={() => copyInfo(contact)}
                      className="p-2 rounded-xl bg-yellow-500/10 text-yellow-600"
                    >
                      <Clock size={18} />
                    </button>
                  </Tooltip>
                ) : (
                  <Tooltip title="Check your email for reply">
                    <CheckCircle
                      size={20}
                      className="text-green-600"
                    />
                  </Tooltip>
                )}

                {contact.status === "pending" && (
                  <button
                    disabled={actionLoading}
                    onClick={() =>
                      updateStatus(
                        contact._id,
                        "approved"
                      )
                    }
                    className="p-2 rounded-xl bg-green-500/10 text-green-600"
                  >
                    <CheckCircle size={18} />
                  </button>
                )}

                <button
                  disabled={actionLoading}
                  onClick={() =>
                    deleteContact(contact._id)
                  }
                  className="p-2 rounded-xl bg-red-500/10 text-red-600"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </motion.div>
          ))
        )}

        {contacts.length % LIMIT === 0 &&
          contacts.length > 0 && (
            <div className="flex justify-center pt-6">
              <button
                onClick={() => fetchContacts(false)}
                className="px-6 py-2 rounded-xl bg-blue-600 text-white"
              >
                Load More
              </button>
            </div>
          )}
      </div>

      {/* ======================
          READ MODAL
      ====================== */}
      <Modal
        open={!!selected}
        onCancel={() => setSelected(null)}
        footer={null}
        title="Message"
      >
        {selected && (
          <div className="space-y-3">
            <p><b>Name:</b> {selected.name}</p>
            <p><b>Email:</b> {selected.email}</p>
            <p><b>Subject:</b> {selected.subject || "-"}</p>
            <p>{selected.message}</p>

            <div className="flex gap-3 pt-4">
              <button
                onClick={() => copyInfo(selected)}
                className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded"
              >
                <Copy size={16} /> Copy
              </button>

              <button
                onClick={printMessage}
                className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded"
              >
                <Printer size={16} /> Print
              </button>
            </div>
          </div>
        )}
      </Modal>
    </main>
  );
}

/* ======================
   STATUS DOT
====================== */
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
