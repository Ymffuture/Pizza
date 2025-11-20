import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Skeleton, Row, Col, Card } from "antd";
import Navbar from "./components/Navbar";
//import Hero from "./components/Hero";
import Footer from "./components/Footer";
//import GeminiAssistant from "./layouts/GeminiAssistant" 
// Lazy loading wrapper
import { lazy, Suspense } from "react";

// ⬇️ Lazy loaded pages
const Policy = lazy(() => import("./pages/Policy"));
const Terms = lazy(() => import("./pages/Terms"));
const SmallProjects = lazy(() => import("./pages/SmallProjects"));
const LargeProjects = lazy(() => import("./pages/LargeProjects"));
const ServerAPI = lazy(() => import("./pages/ServerAPI"));

// Example Home (Optional: Replace with your real one)
const Home = lazy(() => import("./components/Hero"));

// ⬇️ SVG Loader Component
const Loader = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
    <svg width="80" height="80" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <circle cx="100" cy="100" r="45" fill="#0B0E17" stroke="#00FFEA" stroke-width="3" />
  
  <circle cx="100" cy="100" r="12" fill="#00FFEA">
    <animate attributeName="r" values="12;18;12" dur="1.8s" repeatCount="indefinite" />
  </circle>

  <path d="M100 100 Q80 80 80 100 Q80 120 100 120"
    fill="none" stroke="#00FFEA" stroke-width="6">
    <animate attributeName="opacity" values="0;1;0" dur="2s" repeatCount="indefinite" />
  </path>

  <path d="M100 100 Q120 80 120 100 Q120 120 100 120"
    fill="none" stroke="#00FFEA" stroke-width="6">
    <animate attributeName="opacity" values="0;1;0" dur="2s" begin="0.5s" repeatCount="indefinite" />
  </path>
</svg>

    <p className="text-gray-500 mt-3">Loading page...</p>
  </div>
);


  return (
    <>
<Router>
  
          {navbarLoading ? <Skeleton active paragraph={true} style={{ width: "100%", height: 150 }}/> : <Navbar /> }
          {/* MAIN ROUTES */}
      {/* Suspense wraps everything to show loader while components load */}
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/policy" element={<Policy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/small-projects" element={<SmallProjects />} />
          <Route path="/large-projects" element={<LargeProjects />} />
          <Route path="/server-api" element={<ServerAPI />} />

          {/* 404 Page */}
          <Route
            path="*"
            element={
              <div className="min-h-screen flex flex-col items-center justify-center">
                <h1 className="text-4xl font-bold mb-3">404</h1>
                <p className="text-gray-600">Page not found</p>
              </div>
            }
          />
        </Routes>
      </Suspense>
    </Router>
      <Footer />
    </>
  );
};

export default App;

