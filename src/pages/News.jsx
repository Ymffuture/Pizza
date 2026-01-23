import React, { useState, useEffect } from "react";

const NewsComponent = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="h-48 rounded-xl bg-gray-200 dark:bg-gray-800 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center py-8">
        {error}
      </div>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 py-6">
      {/* Header */}
      <header className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">
          📰 Breaking & Global News
        </h1>
        <p className="text-sm opacity-70">
          Latest updates from ZA, US, JP & UA
        </p>
      </header>

      {/* News Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {data?.results?.map((article) => (
          <article
            key={article.link}
            className="group flex flex-col rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-lg transition"
          >
            {/* Image */}
            <div className="h-40 bg-gray-100 dark:bg-gray-900 overflow-hidden">
              {article.image_url ? (
                <img
                  src={article.image_url}
                  alt={article.title}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform"
                />
              ) : (
                <div className="h-full flex items-center justify-center text-sm opacity-50">
                  No Image
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex flex-col gap-3 p-4 flex-1">
              {/* Badges */}
              <div className="flex gap-2 text-xs">
                {article.category?.[0] && (
                  <span className="px-2 py-0.5 rounded bg-cyan-100 text-cyan-700 dark:bg-cyan-900 dark:text-cyan-300">
                    {article.category[0]}
                  </span>
                )}
                <span className="opacity-60">
                  {article.source_id}
                </span>
              </div>

              {/* Title */}
              <h2 className="font-semibold leading-snug line-clamp-3">
                {article.title}
              </h2>

              {/* Description */}
              {article.description && (
                <p className="text-sm opacity-70 line-clamp-3">
                  {article.description}
                </p>
              )}

              {/* Footer */}
              <div className="mt-auto flex items-center justify-between text-xs opacity-60">
                <span>
                  {new Date(article.pubDate).toLocaleDateString()}
                </span>
                <a
                  href={article.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-600 hover:underline"
                >
                  Read →
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default NewsComponent;
