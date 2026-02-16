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

      setArticles(data.articles);
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
    <div style={{ padding: "40px", maxWidth: "1200px", margin: "auto" }}>
      <h1>📰 Latest News</h1>

      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Search topic..."
          style={{ padding: "10px", width: "300px" }}
        />
        <button onClick={() => setPage(1)} style={{ marginLeft: "10px" }}>
          Search
        </button>
      </div>

      {loading && <p>Loading news...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "20px",
        }}
      >
        {articles.map((article) => (
          <NewsCard key={article.id} article={article} />
        ))}
      </div>

      <div style={{ marginTop: "20px" }}>
        <button
          disabled={page === 1}
          onClick={() => setPage((prev) => prev - 1)}
        >
          Previous
        </button>

        <span style={{ margin: "0 10px" }}>Page {page}</span>

        <button onClick={() => setPage((prev) => prev + 1)}>
          Next
        </button>
      </div>
    </div>
  );
}
