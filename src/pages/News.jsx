import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const NewsComponent = () => {
  const [data, setData] = useState(null);
  const [latest, setLatest] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🔍 enable only when debugging
  const DEBUG_MODE = false;

  const navigate = useNavigate();

  useEffect(() => {
    const url =
      "https://newsdata.io/api/1/latest" +
      "?apikey=pub_cf448f1504b94e33aa0bd96f40f0bf91" +
      "&country=za,us" +
      "&language=en" +
      "&excludecategory=crime,sports" +
      "&prioritydomain=top" +
      "&image=1" +
      "&removeduplicate=0";

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch news");
        return res.json();
      })
      .then((res) => {
        setData(res);
        setLatest(res?.results?.[0] || null);
        setShowPopup(Boolean(res?.results?.length));
        toast("News updated");
      })
      .catch((err) => {
        setError(err.message);
        toast.error(err.message || "Failed to load news");
      })
      .finally(() => setLoading(false));
  }, []);

  const openExternalReader = (article) => {
    const reader = window.open(
      article.link,
      "_blank",
      "width=420,height=640,noopener,noreferrer"
    );

    if (!reader) {
      toast.error("Popup blocked");
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
            h1 { font-size: 18px; margin-bottom: 12px; }
            a { color: #60a5fa; text-decoration: none; }
          </style>
        </head>
        <body>
          ${article.image_url ? `<img src="${article.image_url}" />` : ""}
          <h1>${article.title}</h1>
          <p>${article.description || "No description available."}</p>
          <a href="${article.link}" target="_blank">Read full article →</a>
        </body>
      </html>
    `);
  };

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
      <p className="text-center text-red-500 py-10">
        {error}
      </p>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 py-10 pt-16 dark:text-white relative">
      {/* 🔍 DEBUG JSON VIEW */}
      {DEBUG_MODE && data && (
        <pre className="mb-8 p-4 rounded-xl text-xs overflow-auto bg-gray-100 dark:bg-gray-900">
          {JSON.stringify(data, null, 2)}
        </pre>
      )}

      {/* SMART POPUP */}
      {showPopup && latest && (
        <div className="fixed bottom-4 right-4 z-50 w-[90vw] max-w-sm rounded-2xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-2xl p-4">
          <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">
            Latest
          </p>
          <h4 className="font-semibold text-sm line-clamp-2">
            {latest.title}
          </h4>

          <div className="mt-3 flex justify-between items-center gap-3">
            <button
              onClick={() => navigate("/news")}
              className="text-sm text-blue-600 hover:underline"
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
        </div>
      )}

      {/* HEADER */}
      <header className="flex flex-col sm:flex-row sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-semibold">Today’s News</h1>
          <p className="text-sm text-gray-500">
            High-priority stories with images
          </p>
        </div>

        <button
          onClick={() => navigate("/news")}
          className="rounded-full bg-black text-white px-6 py-2 text-sm hover:bg-gray-800 transition"
        >
          View all
        </button>
      </header>

      {/* FEATURED */}
      {latest && (
        <article className="mb-10 rounded-3xl overflow-hidden bg-gray-100 dark:bg-gray-900 shadow-xl">
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
              {latest.description}
            </p>
          </div>
        </article>
      )}
    </section>
  );
};

export default NewsComponent;
