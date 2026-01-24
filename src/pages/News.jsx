import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { FiLock, FiUnlock, FiAlertCircle } from "react-icons/fi";
import { Tooltip } from "antd";
import { Helmet } from "react-helmet";
import { createPortal } from "react-dom";
import { renderMiniViewHTML } from "../utils/MiniView";

/* ======================
   HELPERS
====================== */
const LockTransition = () => {
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLocked(true), 5000); // 5s
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
          exit={{ opacity: 0, scale: 0.6 }}
          transition={{ duration: 0.35 }}
          className="flex items-center"
        >
          <FiLock className="w-3.5 h-3.5 text-gray-500" />
        </motion.span>
      )}
    </AnimatePresence>
  );
};

const isPaidOnly = (value) =>
  typeof value === "string" && value.includes("ONLY AVAILABLE");

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

/* ======================
   MAIN COMPONENT
====================== */
const NewsComponent = () => {
  const [data, setData] = useState(null);
  const [latest, setLatest] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [zoomImage, setZoomImage] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const navigate = useNavigate();

  /* ======================
     FETCH NEWS
  ====================== */
  const fetchNews = async (cancelToken = null) => {
    try {
      setLoading(true);
      setError(null);

      const url =
        "https://newsdata.io/api/1/latest" +
        "?apikey=pub_ac9c8f45cea54c21bf1b8d9bb1ecca16" +
        "&language=en" +
        "&removeduplicate=1";

      const res = await axios.get(url, {
        cancelToken: cancelToken || undefined,
      });

      const articles = res.data.results || [];
      setData({ results: articles });
      setLatest(articles[0] || null);
      setShowPopup(Boolean(articles.length));

      toast("News loaded", { duration: 1200 });
    } catch (err) {
      if (axios.isCancel(err)) {
        console.log("Request canceled:", err.message);
      } else {
        setError(err.message || "Fetch failed");
        toast(err.message || "Fetch failed", { duration: 2000 });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const source = axios.CancelToken.source();
    fetchNews(source.token);
    return () => {
      source.cancel("Component unmounted, request canceled");
    };
  }, []);

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      const source = axios.CancelToken.source();
      await fetchNews(source.token);
    } catch (err) {
      toast(err.message || "Fetch failed", { duration: 2000 });
    } finally {
      setRefreshing(false);
    }
  };

  /* ======================
     MINI READER
  ====================== */
  const openExternalReader = (article) => {
    const reader = window.open("", "_blank", "width=420,height=640");

    if (!reader) {
      toast("Popup blocked", { duration: 2000 });
      return;
    }

    reader.document.open();
    reader.document.write(renderMiniViewHTML(article));
    reader.document.close();
  };

  /* ======================
     LOADING STATE
  ====================== */
  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 pt-20">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="h-48 rounded-2xl bg-gray-200 dark:bg-gray-800 animate-pulse"
          />
        ))}
      </div>
    );
  }

  /* ======================
     ERROR STATE
  ====================== */
  if (error) {
    return (
      <div className="relative w-full h-[80vh] flex items-center justify-center px-4">
        <FiAlertCircle className="absolute text-red-200 dark:text-red-800 opacity-20 w-64 h-64 sm:w-96 sm:h-96" />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center z-10"
        >
          <p className="text-2xl sm:text-3xl font-semibold text-red-600 dark:text-red-400 mb-2">
            Oops! Something went wrong
          </p>
          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-300">
            {error}
          </p>
          <button
            onClick={handleRefresh}
            className={`mt-4 px-6 py-2 ${
              !refreshing
                ? "bg-red-400 dark:bg-red-500"
                : "bg-yellow-400 dark:bg-yellow-600"
            } text-white rounded-lg hover:bg-red-700 transition`}
          >
            {refreshing ? "Refreshing..." : "Retry"}
          </button>
        </motion.div>
      </div>
    );
  }

  /* ======================
     MAIN UI
  ====================== */
  return (
    <section className="max-w-7xl mx-auto px-4 py-10 pt-16 relative dark:text-white bg-white/90 dark:bg-[#0f172a] backdrop-blur-xl">
      <Helmet>
        <title>News Update {latest?.title ? ` – ${latest.title}` : ""}</title>
        <meta
          name="description"
          content={
            latest?.description ||
            latest?.content ||
            "Latest breaking news from South Africa and the United States."
          }
        />
      </Helmet>

      {/* POPUP */}
      {showPopup && latest &&
        createPortal(
          <AnimatePresence>
            <motion.div
              key="news-popup"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="fixed bottom-4 right-4 z-[9999] w-[90vw] max-w-sm rounded-2xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-2xl dark:text-white p-4"
            >
              <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">
                Latest News
              </p>
              <h4 className="font-semibold text-sm line-clamp-2">{latest.title}</h4>
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
            </motion.div>
          </AnimatePresence>,
          document.body
        )}

      {/* HEADER */}
      <header className="flex flex-col sm:flex-row sm:justify-between gap-4 pt-8 mb-8">
        <div>
          <h1 className="text-3xl font-semibold p-2 rounded-xl">Today's News</h1>
          <p className="text-sm text-gray-500">Curated stories from selected countries</p>
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
          {latest.video_url ? (
            <video
              src={latest.video_url}
              controls
              className="h-64 w-full object-cover rounded-t-xl"
            />
          ) : latest.image_url ? (
            <img
              src={latest.image_url}
              alt={latest.title}
              onClick={() =>
                setZoomImage({ src: latest.image_url, alt: latest.title })
              }
              className="h-64 w-full object-cover cursor-zoom-in"
            />
          ) : null}

          <div className="p-6">
            <p className="text-xs uppercase tracking-wide text-gray-500 mb-2">
              Featured
            </p>
            <h2 className="text-xl font-semibold mb-2">{latest.title}</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
              {renderValue(latest.content || latest.description)}
            </p>
          </div>
        </article>
      )}

      {/* GRID */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {data?.results?.slice(1, 12).map((article) => (
          <article
            key={article.link}
            className="rounded-2xl bg-white dark:bg-gray-900 shadow-md hover:shadow-xl transition"
          >
            {article.video_url ? (
              <video
                src={article.video_url}
                controls
                className="h-40 w-full object-cover rounded-t-xl"
              />
            ) : article.image_url ? (
              <img
                src={article.image_url}
                alt={article.title}
                onClick={() =>
                  setZoomImage({ src: article.image_url, alt: article.title })
                }
                className="h-40 w-full object-cover cursor-zoom-in"
              />
            ) : null}
             <div className="p-4 flex flex-col gap-3">
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
                <span>{new Date(article.pubDate).toLocaleString()}</span>
              </div>

               
              <h3 className="font-medium line-clamp-2">{article.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                {renderValue(article.content || article.description)}
              </p>

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
                  {article.keywords.length > 6 && (
                    <span className="px-2 py-0.5 text-xs rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                      +{article.keywords.length - 6} more
                    </span>
                  )}
                </div>
              )}

              <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                <div>
                  <b>Category:</b> {article.category?.join(", ") || "—"}
                </div>
                <div>
                  <b>Country:</b> {article.country?.join(", ") || "—"}
                </div>
                <div>
                  <b>Language:</b> {article.language || "—"}
                </div>
                <div>
                  <b>Type:</b> {article.datatype || "—"}
                </div>
              </div>

              <div className="border-t pt-2 text-xs text-gray-500 space-y-1">
                <div>
                  <b>Sentiment:</b> {renderValue(article.sentiment)}
                </div>
                <div>
                  <b>AI Summary:</b> {renderValue(article.ai_summary)}
                </div>
              </div>

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

      {/* ZOOM IMAGE MODAL */}
      {zoomImage &&
        createPortal(
          <AnimatePresence>
            <motion.div
              key="zoom-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[10000] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
              onClick={() => setZoomImage(null)}
            >
              <motion.img
                src={zoomImage.src}
                alt={zoomImage.alt}
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.85, opacity: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 25 }}
                className="max-h-[90vh] max-w-[90vw] rounded-xl shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              />
            </motion.div>
          </AnimatePresence>,
          document.body
        )}
    </section>
  );
};

export default NewsComponent;
