// MiniView.js
export const renderMiniViewHTML = (article) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>SwiftMeta • ${article.title}</title>

  <style>
    :root {
      --bg: #0f172a;
      --card: #020617;
      --text: #e5e7eb;
      --muted: #94a3b8;
      --accent: #3b82f6;
      --border: rgba(255,255,255,0.08);
    }

    * {
      box-sizing: border-box;
    }

    body {
      margin: 0;
      padding: 12px;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      background: var(--bg);
      color: var(--text);
    }

    .card {
      background: var(--card);
      border-radius: 14px;
      overflow: hidden;
      box-shadow: 0 20px 40px rgba(0,0,0,0.4);
      animation: fadeIn 0.25s ease-out;
    }

    .media img {
      width: 100%;
      height: auto;
      display: block;
    }

    .content {
      padding: 14px;
    }

    .source {
      font-size: 11px;
      color: var(--muted);
      margin-bottom: 6px;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    h1 {
      font-size: 16px;
      line-height: 1.35;
      margin: 0 0 8px;
    }

    p {
      font-size: 14px;
      color: var(--muted);
      line-height: 1.6;
      margin: 0;
    }

    .footer {
      border-top: 1px solid var(--border);
      padding: 10px 14px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    a {
      color: var(--accent);
      font-size: 13px;
      text-decoration: none;
      font-weight: 500;
    }

    a:hover {
      text-decoration: underline;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(8px) scale(0.98);
      }
      to {
        opacity: 1;
        transform: none;
      }
    }
  </style>
</head>

<body>
  <article class="card">
    ${
      article.image_url
        ? `<div class="media"><img src="${article.image_url}" alt="Article image" /></div>`
        : ""
    }

    <div class="content">
      <div class="source">
        ${article.source_name || "SwiftMeta"}
      </div>

      <h1>${article.title}</h1>

      <p>
        ${article.description || article.content || "No content available."}
      </p>
    </div>

    <div class="footer">
      <span></span>
      <a href="${article.link}" target="_blank" rel="noopener noreferrer">
        Read full article →
      </a>
    </div>
  </article>
</body>
</html>
`;
