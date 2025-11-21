import React, { useState, useEffect, lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Skeleton } from "antd";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import NotFound from "./pages/NotFound";
// Lazy-loaded pages
const Policy = lazy(() => import("./pages/Policy"));
const Terms = lazy(() => import("./pages/Terms"));
const SmallProjects = lazy(() => import("./pages/SmallProjects"));
const LargeProjects = lazy(() => import("./pages/LargeProjects"));
const ServerAPI = lazy(() => import("./pages/ServerAPI"));
const Home = lazy(() => import("./Home"));

// SVG Loader
const Loader = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
    <svg width="80" height="80" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="45" fill="#0B0E17" stroke="#00FFEA" strokeWidth="3" />

      <circle cx="100" cy="100" r="12" fill="#00FFEA">
        <animate attributeName="r" values="12;18;12" dur="1.8s" repeatCount="indefinite" />
      </circle>

      <path
        d="M100 100 Q80 80 80 100 Q80 120 100 120"
        fill="none"
        stroke="#00FFEA"
        strokeWidth="6"
      >
        <animate attributeName="opacity" values="0;1;0" dur="2s" repeatCount="indefinite" />
      </path>

      <path
        d="M100 100 Q120 80 120 100 Q120 120 100 120"
        fill="none"
        stroke="#00FFEA"
        strokeWidth="6"
      >
        <animate attributeName="opacity" values="0;1;0" dur="2s" begin="0.5s" repeatCount="indefinite" />
      </path>
    </svg>

    <p className="text-gray-500 mt-3">Loading page...</p>
  </div>
);

const App = () => {
  // Show Skeleton for 1 second to simulate loading
  const [navbarLoading, setNavbarLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setNavbarLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Router>
        {/* Navbar */}
        {navbarLoading ? (
          <Skeleton active paragraph={true} style={{ width: "100%", height: 150 }} />
        ) : (
          <Navbar />
        )}

        {/* Page Routes */}
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
                <NotFound/>
              }
            />
          </Routes>
        </Suspense>

        {/* Footer */}
        <Footer />
      </Router>
    </>
  );
};

export default App;
