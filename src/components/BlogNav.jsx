import React from "react";
import { Link } from "react-router-dom";

export default function Navbar(){
  return (
    <nav style={{ background: "#fff", padding: 12, borderBottom: "1px solid #eee" }}>
      <div style={{ maxWidth: 920, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <Link to="/">SwiftMeta Blog</Link>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
          <Link to="/new">New Post</Link>
          <Link to="/profile">Profile</Link>
        </div>
      </div>
    </nav>
  );
}
