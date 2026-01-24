import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { FiLock, FiUnlock } from "react-icons/fi";
import { Tooltip } from "antd";
import {Helmet} from "react-helmet" ;
import { createPortal } from "react-dom";
import { renderMiniViewHTML } from "../utils/MiniView";

/* ======================
   HELPERS
====================== */
const LockTransition = () => {
  const [locked, setLocked] = React.useState(false);
   

  React.useEffect(() => {
    const t = setTimeout(() => setLocked(true), 5000); 
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
          <FiLock className="w-3.5 h-3.5 text-gray-500 animate-pulse" />
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
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-gray-700 dark:text-gray-300 text-xs cursor-help">
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
const [zoomImage, setZoomImage] = useState(null);

const [refreshing, setRefreshing] = useState(false);

  const navigate = useNavigate();

   const PAGE_SIZE = 9;
   const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);


  /* ======================
     FETCH NEWS
  ====================== */
  const fetchNews = async (showToast = true) => {
  try {
    setLoading(true);
    setError(null);

    const url =
      "https://newsdata.io/api/1/latest" +
      "?apikey=pub_cf448f1504b94e33aa0bd96f40f0bf91" +
      "&country=za,us" +
      "&language=en" +
      "&excludecategory=crime,sports" +
      "&removeduplicate=1";

    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch news");

    const json = await res.json();

    setData(json);
    setLatest(json?.results?.[0] || null);
    setShowPopup(Boolean(json?.results?.length));
    setVisibleCount(PAGE_SIZE); // reset pagination

    showToast && toast.success("News refreshed", { duration: 1200 });
  } catch (err) {
    setError(err.message);
    toast.error(err.message || "Fetch failed");
  } finally {
    setLoading(false);
    setRefreshing(false);
  }
};

   const handleLoadMore = () => {
  setVisibleCount((prev) => prev + PAGE_SIZE);
};

const handleRefresh = () => {
  setRefreshing(true);
  fetchNews();
};

  /* ======================
     MINI EXTERNAL READER
  ====================== */
  const openExternalReader = (article) => {
  const reader = window.open(
    "",
    "_blank",
    "width=420,height=640"
  );

  if (!reader) {
    toast.error("Popup blocked", { duration: 2000 });
    return;
  }

  reader.document.open();
  reader.document.write(renderMiniViewHTML(article));
  reader.document.close();
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
    <section className="max-w-7xl mx-auto px-4 py-10 pt-16 relative dark:text-white bg-white/90 dark:bg-[#0f172a] backdrop-blur-xl">
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
        backdrop-blur-xl shadow-2xl dark:text-white p-4"
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
          <h1 className="text-3xl font-semibold p-2 rounded-xl">Today’s News</h1>
          <p className="text-sm text-gray-500">
            Curated stories from ZA & US
          </p>
        </div>

         <div className="flex items-center gap-3">
  <button
    onClick={handleRefresh}
    disabled={refreshing}
    className="rounded-full border px-5 py-2 text-sm
               hover:bg-gray-100 dark:hover:bg-gray-800 transition"
  >
    {refreshing ? "Refreshing…" : "Refresh"}
  </button>

  <button
    onClick={() => navigate("/news")}
    className="rounded-full bg-black text-white px-6 py-2 text-sm
               hover:bg-gray-800 transition"
  >
    View all news
  </button>
</div>

      </header>

      {/* FEATURED */}
      {latest && (
        <article className="mb-10 rounded-3xl overflow-hidden shadow-xl bg-gray-100 dark:bg-gray-900">
          {latest.image_url && (
  <img
    src={latest.image_url}
    alt={latest.title}
    onClick={() =>
      setZoomImage({
        src: latest.image_url,
        alt: latest.title,
      })
    }
    className="h-64 w-full object-cover cursor-zoom-in"
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
        {data?.results?.slice(1, visibleCount + 1).map((article) => (
          <article
            key={article.link}
            className="rounded-2xl bg-white dark:bg-gray-900 shadow-md hover:shadow-xl transition"
          >
            {article.image_url && (
              
  <img
    src={article.image_url}
    alt={article.title}
    onClick={() =>
      setZoomImage({
        src: article.image_url,
        alt: article.title,
      })
    }
    className="h-40 w-full object-cover cursor-zoom-in"
  />
)}

         

            <div className="p-4 flex flex-col gap-3">
              {/* META */}
              <div className="flex items-center gap-2 text-xs text-gray-500">
                {article.source_icon && (
             <Tooltip title={`Source: ${article.source_name || "loading..."}`}>
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

    {article.keywords.length > 6 && (
      <span className="px-2 py-0.5 text-xs rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
        +{article.keywords.length - 6} more
      </span>
    )}
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

         {data?.results?.length > visibleCount + 1 && (
  <div className="flex justify-center mt-10">
    <button
      onClick={handleLoadMore}
      className="px-6 py-2 rounded-full bg-gray-900 text-white text-sm
                 hover:bg-gray-800 transition"
    >
      Load more news
    </button>
  </div>
)}

      </div>
       
       {zoomImage &&
  createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[10000] bg-black/80 backdrop-blur-sm
                   flex items-center justify-center p-4"
        onClick={() => setZoomImage(null)}
      >
        <motion.img
          src={zoomImage.src}
          alt={zoomImage.alt}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
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
