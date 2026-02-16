import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import NewsCard from "./NewsCard";

const API_URL = "https://swiftmeta.onrender.com/api/news";

export default function NewsPage() {
  const [articles, setArticles] = useState([]);
  const [keyword, setKeyword] = useState("technology");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchNews = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const { data } = await axios.get(API_URL, {
        params: { keyword, page },
      });

      setArticles(data.articles || []);
    } catch (err) {
      setError("Webpage: Failed to load news.");
    } finally {
      setLoading(false);
    }
  }, [keyword, page]);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6 sm:px-12">
      <h1 className="text-4xl font-semibold text-gray-900 mb-8 text-center">
        📰 Latest News
      </h1>

      {/* Search */}
      <div className="flex justify-center mb-8 space-x-4">
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Search topic..."
          className="px-4 py-2 rounded-xl border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 w-64"
        />
        <button
          onClick={() => setPage(1)}
          className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors duration-200 shadow-md"
        >
          Search
        </button>
      </div>

      {/* Loading / Error */}
      {loading && (
        <p className="text-center text-gray-500 text-lg animate-pulse">
          Loading news...
        </p>
      )}
      {error && <p className="text-center text-red-500">{error}</p>}

      {/* News Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {articles.map((article) => (
          <NewsCard key={article.id} article={article} />
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center mt-10 space-x-6">
        <button
          disabled={page === 1}
          onClick={() => setPage((prev) => prev - 1)}
          className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          Previous
        </button>

        <span className="text-gray-700 font-medium">Page {page}</span>

        <button
          onClick={() => setPage((prev) => prev + 1)}
          className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors duration-200"
        >
          Next
        </button>
      </div>
    </div>
  );
}
