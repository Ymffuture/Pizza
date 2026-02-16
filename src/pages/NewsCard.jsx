import React from "react";

export default function NewsCard({ article }) {
  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: "8px",
        overflow: "hidden",
        boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
      }}
    >
      {article.image && (
        <img
          src={article.image}
          alt={article.title}
          style={{ width: "100%", height: "200px", objectFit: "cover" }}
        />
      )}

      <div style={{ padding: "15px" }}>
        <h3>{article.title}</h3>
        <p style={{ fontSize: "14px", color: "#555" }}>
          {article.summary}
        </p>

        <small>
          {article.source} • {new Date(article.date).toLocaleDateString()}
        </small>

        <br />

        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: "inline-block", marginTop: "10px" }}
        >
          Read More →
        </a>
      </div>
    </div>
  );
}
