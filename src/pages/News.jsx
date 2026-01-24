import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { FiLock, FiUnlock } from "react-icons/fi";
import { Tooltip } from "antd";
import {Helmet} from "react-helmet" ;
import { createPortal } from "react-dom";

/* ======================
   HELPERS
====================== */
const LockTransition = () => {
  const [locked, setLocked] = React.useState(false);

  React.useEffect(() => {
    const t = setTimeout(() => setLocked(true), 2000); // ⏱️ 2s
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence mode="wait">
      {!locked ? (
        <motion.span
          key="unlock"
          initial={{ opacity: 0, scale: 0.6, rotate: -90 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          exit={{ opacity: 0, scale: 0.6, rotate: 90 }}
          transition={{ duration: 0.35 }}
          className="flex items-center"
        >
          <FiUnlock className="w-3.5 h-3.5 text-green-500" />
        </motion.span>
      ) : (
        <motion.span
          key="lock"
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.35 }}
          className="flex items-center"
        >
          <FiLock className="w-3.5 h-3.5 text-yellow-500" />
        </motion.span>
      )}
    </AnimatePresence>
  );
};

const isPaidOnly = (value) =>   typeof value === "string" && value.includes("ONLY AVAILABLE");

const renderValue = (value) => {
  if (!value) return "—";

  if (isPaidOnly(value)) {
    return (
      <Tooltip title="This information is only available on paid plans">
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-yellow-700 dark:text-yellow-300 text-xs cursor-help">
          <LockTransition />
        </span>
      </Tooltip>
    );
  }

  return value;
};




const NewsComponent = () => {
  const [data, setData] = useState(null);
  const [latest, setLatest] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  /* ======================
     FETCH NEWS
  ====================== */
  useEffect(() => {
    const url =
      "https://newsdata.io/api/1/latest" +
      "?apikey=pub_cf448f1504b94e33aa0bd96f40f0bf91" +
      "&country=za,us" +
      "&language=en" +
      "&excludecategory=crime,sports" +
      "&removeduplicate=1";

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch news");
        return res.json();
      })
      .then((res) => {
        setData(res);
        setLatest(res?.results?.[0] || null);
        setShowPopup(Boolean(res?.results?.length));
        toast("News loaded", { duration: 200 });
      })
      .catch((err) => {
        setError(err.message);
        toast.error(err.message || "Fetch failed", { duration: 2000 });
      })
      .finally(() => setLoading(false));
  }, []);

  /* ======================
     MINI EXTERNAL READER
  ====================== */
  const openExternalReader = (article) => {
    const reader = window.open(
      article.link,
      "_blank",
      "width=420,height=640,noopener,noreferrer"
    );

    if (!reader) {
      toast.error("Popup blocked", { duration: 2000 });
      return;
    }

    reader.document.write(`
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>${article.title}</title>
          <style>
            body {
              font-family: system-ui, sans-serif;
              padding: 16px;
              background: #0f172a;
              color: #e5e7eb;
              line-height: 1.6;
            }
            img {
              width: 100%;
              border-radius: 12px;
              margin-bottom: 12px;
            }
            h1 {
              font-size: 18px;
              margin-bottom: 12px;
            }
            a {
              color: #60a5fa;
              text-decoration: none;
            }
          </style>
        </head>
        <body>
          ${article.image_url ? `<img src="${article.image_url}" />` : ""}
          <h1>${article.title}</h1>
          <p>${article.description || article.content || "No content available."}</p>
          <a href="${article.link}" target="_blank">Read full article →</a>
        </body>
      </html>
    `);
  };

  /* ======================
     STATES
  ====================== */
  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="h-56 rounded-2xl bg-gray-200 dark:bg-gray-800 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <p className="text-center text-red-500 py-8">
        {error}
      </p>
    );
  }

  /* ======================
     UI
  ====================== */
  return (
    <section className="max-w-7xl mx-auto px-4 py-10 pt-16 relative dark:text-white bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl">
      {/* POPUP */}
       <Helmet>
  <title>
    News Update {latest?.title ? ` – ${latest.title}` : ""}
  </title>

  <meta
    name="description"
    content={
      latest?.description ||
      latest?.content ||
      "Latest breaking news from South Africa and the United States."
    }
  />
</Helmet>
{showPopup &&
  latest &&
  createPortal(
    <div
      className="fixed bottom-4 right-4 z-[9999]
        w-[90vw] max-w-sm
        rounded-2xl bg-white/90 dark:bg-gray-900/90
        backdrop-blur-xl shadow-2xl p-4"
    >
      <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">
        Latest News
      </p>

      <h4 className="font-semibold text-sm line-clamp-2">
        {latest.title}
      </h4>

      <div className="mt-3 flex justify-between items-center gap-3">
        <button
          onClick={() => navigate("/news")}
          className="text-sm font-medium text-blue-600 hover:underline"
        >
          Open
        </button>

        <button
          onClick={() => openExternalReader(latest)}
          className="text-sm text-gray-600 dark:text-gray-300 hover:underline"
        >
          Mini reader
        </button>

        <button
          onClick={() => setShowPopup(false)}
          className="text-xs opacity-60 hover:opacity-100"
        >
          Dismiss
        </button>
      </div>
    </div>,
    document.body
  )}


      {/* HEADER */}
      <header className="flex flex-col sm:flex-row sm:justify-between gap-4 pt-8 mb-8">
        <div>
          <h1 className="text-3xl font-semibold bg-red-50 dark:bg-red-300 p-2 rounded-xl">Today’s News</h1>
          <p className="text-sm text-gray-500">
            Curated stories from ZA & US
          </p>
        </div>

        <button
          onClick={() => navigate("/news")}
          className="rounded-full bg-black text-white px-6 py-2 text-sm font-medium hover:bg-gray-800 transition"
        >
          View all news
        </button>
      </header>

      {/* FEATURED */}
      {latest && (
        <article className="mb-10 rounded-3xl overflow-hidden shadow-xl bg-gray-100 dark:bg-gray-900">
          {latest.image_url && (
            <img
              src={latest.image_url}
              alt={latest.title}
              className="h-64 w-full object-cover"
            />
          )}
          <div className="p-6">
            <p className="text-xs uppercase tracking-wide text-gray-500 mb-2">
              Featured
            </p>
            <h2 className="text-xl font-semibold mb-2">
              {latest.title}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
              {renderValue(latest.content || latest.description)}
            </p>
          </div>
        </article>
      )}

      {/* GRID */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {data?.results?.slice(1, 7).map((article) => (
          <article
            key={article.link}
            className="rounded-2xl bg-white dark:bg-gray-900 shadow-md hover:shadow-xl transition"
          >
            {article.image_url && (
              <img
                src={article.image_url}
                alt={article.title}
                className="h-40 w-full object-cover"
              />
            )}

            <div className="p-4 flex flex-col gap-3">
              {/* META */}
              <div className="flex items-center gap-2 text-xs text-gray-500">
                {article.source_icon && (
             <Tooltip title={`Source: ${article.source_name}`}>
                  <img
                    src={article.source_icon}
                    alt={article.source_name}
                    className="w-4 h-4 rounded"
                  />
                </Tooltip>
                )}
                <span>{article.source_name || article.source_id}</span>
                <span>•</span>
                <span>
                  {new Date(article.pubDate).toLocaleString()}
                </span>
              </div>

              {/* TITLE */}
              <h3 className="font-medium line-clamp-2">
                {article.title}
              </h3>

              {/* CONTENT */}
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                {renderValue(article.content || article.description)}
              </p>

              {/* KEYWORDS */}
              {Array.isArray(article.keywords) && article.keywords.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {article.keywords.slice(0, 6).map((kw) => (
                    <span
                      key={kw}
                      className="px-2 py-0.5 text-xs rounded-full bg-gray-100 dark:bg-gray-800"
                    >
                      #{kw}
                    </span>
                  ))}
                </div>
              )}

              {/* INFO GRID */}
              <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                <div><b>Category:</b> {article.category?.join(", ") || "—"}</div>
                <div><b>Country:</b> {article.country?.join(", ") || "—"}</div>
                <div><b>Language:</b> {article.language || "—"}</div>
                <div><b>Type:</b> {article.datatype || "—"}</div>
              </div>

              {/* AI / SENTIMENT */}
              <div className="border-t pt-2 text-xs text-gray-500 space-y-1">
                <div><b>Sentiment:</b> {renderValue(article.sentiment)}</div>
                <div><b>AI Summary:</b> {renderValue(article.ai_summary)}</div>
              </div>

              {/* ACTIONS */}
              <div className="flex justify-between pt-2">
                <a
                  href={article.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline"
                >
                  Read →
                </a>
                <button
                  onClick={() => openExternalReader(article)}
                  className="text-xs text-gray-500 hover:underline"
                >
                  Mini view
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default NewsComponent;
