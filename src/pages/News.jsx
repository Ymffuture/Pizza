import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const NewsComponent = () => {
  const [data, setData] = useState(null);
  const [latest, setLatest] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const url =
      "https://newsdata.io/api/1/latest" +
      "?apikey=pub_cf448f1504b94e33aa0bd96f40f0bf91" +
      "&country=za,us,jp,ua" +
      "&language=en" +
      "&category=breaking,education,sports,world,other" +
      "&removeduplicate=1";

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch news");
        return res.json();
      })
      .then((res) => {
        setData(res);
        setLatest(res?.results?.[0]);
        setShowPopup(true);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

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

  return (
    <section className="max-w-7xl mx-auto px-4 py-10 relative pt-16">
      {/* SMART POPUP */}
      {showPopup && latest && (
        <div className="fixed bottom-6 right-6 z-50 w-80 rounded-2xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-2xl p-4">
          <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">
            Latest News
          </p>
          <h4 className="font-semibold text-sm leading-snug line-clamp-2">
            {latest.title}
          </h4>

          <div className="mt-3 flex justify-between items-center">
            <button
              onClick={() => navigate("/news")}
              className="text-sm font-medium text-blue-600 hover:underline"
            >
              Open →
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
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            Today’s News
          </h1>
          <p className="text-sm text-gray-500">
            Curated global stories that matter
          </p>
        </div>

        <button
          onClick={() => navigate("/news")}
          className="rounded-full bg-black text-white px-6 py-2 text-sm font-medium hover:bg-gray-800 transition"
        >
          View all news
        </button>
      </header>

      {/* FEATURED STORY */}
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
            <h2 className="text-xl font-semibold leading-snug mb-2">
              {latest.title}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
              {latest.description}
            </p>
          </div>
        </article>
      )}

      {/* NEWS GRID */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {data?.results?.slice(1, 7).map((article) => (
          <article
            key={article.link}
            className="rounded-2xl bg-white dark:bg-gray-900 shadow-md hover:shadow-xl transition overflow-hidden"
          >
            {article.image_url && (
              <img
                src={article.image_url}
                alt={article.title}
                className="h-40 w-full object-cover"
              />
            )}

            <div className="p-4 flex flex-col gap-2">
              <p className="text-xs text-gray-500">
                {article.source_id} ·{" "}
                {new Date(article.pubDate).toLocaleDateString()}
              </p>

              <h3 className="font-medium leading-snug line-clamp-2">
                {article.title}
              </h3>

              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                {article.description}
              </p>

              <a
                href={article.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 mt-2 hover:underline"
              >
                Read more →
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default NewsComponent;
