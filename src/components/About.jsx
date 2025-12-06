import React from "react";

export default function About() {
  return (
    <div style={{
      maxWidth: 800,
      margin: "0 auto",
      padding: "2rem",
      fontFamily: "system-ui, sans-serif",
      lineHeight: 1.6,
    }}>
      <h1>About SwiftMeta</h1>

      <p>
        <strong>SwiftMeta</strong> is described as a hub for exploring the Swift programming language from a “meta-perspective.” According to their website, the platform focuses not just on language syntax, but also on tooling, productivity, soft skills, and broader ecosystem thinking. :contentReference[oaicite:1]{index=1}
      </p>

      <p>
        On SwiftMeta you might find articles about improving your workflow, using tools around Swift (for example switching Xcode versions), or tips and techniques to help you as an engineer think more effectively about architecture, productivity, and development habits — beyond just writing code. :contentReference[oaicite:2]{index=2}
      </p>

      <p>
        If you want to explore it yourself: <a 
          href="https://swiftmeta.vercel.app" 
          target="_blank" 
          rel="noopener noreferrer"
          style={{ color: "#1890ff" }}
        >
          Visit SwiftMETA
        </a>
      </p>

      <h2>Why this page exists</h2>
      <p>
        This component can serve as an “About” or “External resources” reference in a larger React application. It’s especially useful if you want to give users context about SwiftMETA before sending them off — or to embed as a small summary.
      </p>

      <h2>Usage</h2>
      <p>Simply import and render <code>&lt;AboutSwiftMeta /&gt;</code> wherever you want this content shown.</p>
    </div>
  );
}
 
