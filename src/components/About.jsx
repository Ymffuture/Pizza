import React from "react";

export default function About() {
  return (
    <div
      style={{
        backgroundColor: "#f0f2f5",
        minHeight: "100vh",
        padding: "2rem 1rem",
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
      }}
      className="m-5"
    >
      <div
        style={{
          maxWidth: 760,
          margin: "0 auto",
          backgroundColor: "#ffffff",
          borderRadius: 12,
          padding: "2rem",
          boxShadow: "0 1px 2px rgba(0,0,0,0.08)",
        }}
      >
        {/* Header */}
        <h1
          style={{
            fontSize: "1.75rem",
            fontWeight: 700,
            color: "#050505",
            marginBottom: "0.75rem",
          }}
        >
          About SwiftMeta
        </h1>

        <p
          style={{
            fontSize: "0.95rem",
            color: "#65676b",
            marginBottom: "1.5rem",
          }}
        >
          Learn Swift beyond syntax — mindset, tools, and productivity.
        </p>

        {/* Content */}
        <p style={{ color: "#050505", marginBottom: "1rem" }}>
          <strong>SwiftMeta</strong> is a platform focused on exploring the Swift
          programming language from a broader, meta-level perspective. Instead
          of only covering syntax, it emphasizes tooling, workflow efficiency,
          developer thinking, and ecosystem awareness.
        </p>

        <p style={{ color: "#050505", marginBottom: "1rem" }}>
          You’ll find insights on improving productivity, managing Xcode
          versions, making better architectural decisions, and developing
          healthier engineering habits — topics that help you grow beyond just
          writing code.
        </p>

        {/* Link Card */}
        <div
          style={{
            backgroundColor: "#f0f2f5",
            borderRadius: 10,
            padding: "1rem",
            margin: "1.5rem 0",
          }}
        >
          <a
            href="https://swiftmeta.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "#1877f2",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Visit SwiftMeta →
          </a>
        </div>

        {/* Divider */}
        <hr
          style={{
            border: "none",
            borderTop: "1px solid #e4e6eb",
            margin: "2rem 0",
          }}
        />

        {/* Why section */}
        <h2
          style={{
            fontSize: "1.25rem",
            fontWeight: 600,
            color: "#050505",
            marginBottom: "0.5rem",
          }}
        >
          Why this page exists
        </h2>

        <p style={{ color: "#050505", marginBottom: "1rem" }}>
          This page acts as a lightweight reference or “About” section inside a
          larger React application. It gives users context before redirecting
          them to SwiftMeta or embedding it as an external resource summary.
        </p>

        {/* Usage */}
        <h2
          style={{
            fontSize: "1.25rem",
            fontWeight: 600,
            color: "#050505",
            marginBottom: "0.5rem",
          }}
        >
          Usage
        </h2>

        <p style={{ color: "#050505" }}>
          Import and render the component wherever you need it:
        </p>

        <pre
          style={{
            backgroundColor: "#f0f2f5",
            padding: "0.75rem 1rem",
            borderRadius: 8,
            fontSize: "0.85rem",
            marginTop: "0.75rem",
            overflowX: "auto",
          }}
        >
          {"<About />"}
        </pre>
      </div>
    </div>
  );
}
