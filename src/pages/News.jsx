import React, { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";

const NewsComponent = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const notifiedRef = useRef(false);

  useEffect(() => {
    const url =
      "https://newsdata.io/api/1/latest" +
      "?apikey=pub_cf448f1504b94e33aa0bd96f40f0bf91" +
      "&country=za,us,jp,ua,gb,de,in,br" +
      "&language=en" +
      "&category=breaking,education,sports,world,entertainment,crime,business,food,technology,science,health,politics,environment,other" +
      "&removeduplicate=1";

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch news");
        return res.json();
      })
      .then((res) => {
        setData(res);

        // 🔔 Notify only once if there is fresh content
        if (!notifiedRef.current && res?.results?.length > 0) {
          toast("New headlines just dropped", {
            icon: "📰",
            duration: 4000,
          });
          notifiedRef.current = true;
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="h-56 rounded-2xl bg-gray-200/70 dark:bg-gray-800/70 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10 text-red-500">
        {error}
      </div>
    );
  }

  const featured = data?.results?.[0];
  const rest = data?.results?.slice(1, 7);

  return (
    <section className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            News
          </h1>
          <p className="text-sm opacity-60">
            Curated global headlines
          </p>
        </div>

        <a
          href="/news"
          className="rounded-full px-5 py-2 text-sm font-medium
          bg-black text-white dark:bg-white dark:text-black
          hover:opacity-90 transition"
        >
          View all
        </a>
      </header>

      {/* Featured */}
      {featured && (
        <article className="relative rounded-3xl overflow-hidden bg-gray-100 dark:bg-gray-900">
          {featured.image_url && (
            <img
              src={featured.image_url}
              alt={featured.title}
              className="absolute inset-0 h-full w-full object-cover opacity-80"
            />
          )}
          <div className="relative z-10 p-8 max-w-xl backdrop-blur-md bg-white/70 dark:bg-black/50">
            <span className="text-xs uppercase tracking-wide opacity-70">
              Latest
            </span>
            <h2 className="mt-2 text-2xl font-semibold leading-tight">
              {featured.title}
            </h2>
            {featured.description && (
              <p className="mt-3 text-sm opacity-80 line-clamp-3">
                {featured.description}
              </p>
            )}
            <a
              href={featured.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-4 text-sm font-medium underline"
            >
              Read story →
            </a>
          </div>
        </article>
      )}

      {/* Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {rest?.map((article) => (
          <article
            key={article.link}
            className="rounded-2xl bg-white dark:bg-gray-900 p-5
            shadow-sm hover:shadow-md transition"
          >
            <div className="flex gap-2 text-xs mb-2">
              {article.category?.[0] && (
                <span className="px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800">
                  {article.category[0]}
                </span>
              )}
              <span className="opacity-50">
                {article.source_id}
              </span>
            </div>

            <h3 className="font-medium leading-snug line-clamp-3">
              {article.title}
            </h3>

            <p className="mt-2 text-sm opacity-70 line-clamp-2">
              {article.description}
            </p>

            <div className="mt-4 text-xs opacity-60 flex justify-between">
              <span>
                {new Date(article.pubDate).toLocaleDateString()}
              </span>
              <a
                href={article.link}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                Open →
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default NewsComponent;
