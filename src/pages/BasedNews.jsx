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
      setError("Failed to load news.");
    } finally {
      setLoading(false);
    }
  }, [keyword, page]);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  return (
    <div className="min-h-screen bg-[#F3F2F1] py-12 px-6 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <h1 className="text-3xl font-semibold text-[#323130] mb-10">
          Latest News
        </h1>

        {/* Search Panel */}
        <div className="bg-white/80 backdrop-blur-md border border-[#E1DFDD] rounded-xl p-6 shadow-sm mb-10">
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Search topic..."
              className="flex-1 px-4 py-2 rounded-md border border-[#8A8886] focus:border-[#0F6CBD] focus:ring-2 focus:ring-[#0F6CBD]/40 outline-none transition"
            />

            <button
              onClick={() => setPage(1)}
              className="px-6 py-2 rounded-md bg-[#0F6CBD] text-white font-medium hover:bg-[#115EA3] transition shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0F6CBD]/40"
            >
              Search
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-[#0F6CBD] border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="text-red-600 bg-red-50 border border-red-200 p-4 rounded-md mb-6">
            {error}
          </div>
        )}

        {/* News Grid */}
        {!loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {articles.map((article) => (
              <NewsCard key={article.id} article={article} />
            ))}
          </div>
        )}

        {/* Pagination */}
        <div className="flex justify-center items-center gap-6 mt-14">
          <button
            disabled={page === 1}
            onClick={() => setPage((prev) => prev - 1)}
            className="px-5 py-2 rounded-md border border-[#8A8886] text-[#323130] hover:bg-[#EDEBE9] transition disabled:opacity-40"
          >
            Previous
          </button>

          <span className="text-[#605E5C] font-medium">
            Page {page}
          </span>

          <button
            onClick={() => setPage((prev) => prev + 1)}
            className="px-5 py-2 rounded-md border border-[#8A8886] text-[#323130] hover:bg-[#EDEBE9] transition"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
