import React, { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Register from "./pages/Register";
import VerifyEmail from "./pages/VerifyEmail";
import LoginPhone from "./pages/LoginPhone";
import Feed from "./pages/Feed";
import NewPost from "./pages/NewPost";
import Profile from "./pages/Profile";
import Navbar from "./components/Navbar";
import { setToken } from "./api";

export default function BlogPages(){
  useEffect(()=>{
    const t = localStorage.getItem("token");
    setToken(t);
  }, []);

  return (
    <>
      <Toaster />
      <Navbar />
      <div style={{ maxWidth: 920, margin: "28px auto", padding: "0 16px" }}>
        <Routes>
          <Route path="/" element={<Feed />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/login" element={<LoginPhone />} />
          <Route path="/new" element={<NewPost />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
    </>
  );
}
