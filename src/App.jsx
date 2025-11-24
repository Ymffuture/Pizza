import React, { useState, useEffect, lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Skeleton } from "antd";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import NotFound from "./pages/NotFound";
import SignApp from "./layouts/SignIn_Up";

// Dashboard
import DashboardLayout from "./components/dashboard/DashboardLayout";
import Dashboard from "./components/dashboard/Dashboard";

const Policy = lazy(() => import("./pages/Policy"));
const Terms = lazy(() => import("./pages/Terms"));
const SmallProjects = lazy(() => import("./pages/SmallProjects"));
const LargeProjects = lazy(() => import("./pages/LargeProjects"));
const ServerAPI = lazy(() => import("./pages/ServerAPI"));
const Home = lazy(() => import("./Home"));
const Build = lazy(() =>import("./components/dashboard/pages/Build")) ;
const Pricing = lazy(() =>import("./components/dashboard/pages/Pricing")) ;
const FreeProjects = lazy(() =>import("./components/dashboard/pages/FreeProjects"));

const Loader = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-transparent">
  <svg
    width="90"
    height="90"
    viewBox="0 0 100 100"
    xmlns="http://www.w3.org/2000/svg"
    className="animate-[spin_2.8s_linear_infinite]"
  >
    {/* Outer ring */}
    <circle
      cx="50"
      cy="50"
      r="40"
      stroke="currentColor"
      strokeWidth="6"
      strokeLinecap="round"
      fill="none"
      className="text-gray-300 dark:text-gray-700"
      strokeDasharray="250"
      strokeDashoffset="180"
    />

    {/* Inner pulsing dot */}
    <circle cx="50" cy="50" r="10" fill="#00E5FF">
      <animate
        attributeName="r"
        values="10;14;10"
        dur="1.6s"
        repeatCount="indefinite"
      />
      <animate
        attributeName="opacity"
        values="1;0.6;1"
        dur="1.6s"
        repeatCount="indefinite"
      />
    </circle>
  </svg>

  <p className="text-gray-500 dark:text-gray-400 mt-3 text-sm tracking-wide">
    Loading page...
  </p>
</div>

);

const App = () => {
  const [navbarLoading, setNavbarLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setNavbarLoading(false), 800);
  }, []);

  return (
    <Router>
      {/* REAL NAVBAR */}
      {navbarLoading ? (
        <Skeleton active paragraph={{ rows: 1 }} />
      ) : (
        <Navbar />
      )}

      <Suspense fallback={<Loader />}>
        <Routes>

          {/* PUBLIC ROUTES */}
          <Route path="/" element={<Home />} />
          <Route path="/policy" element={<Policy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/small-projects" element={<SmallProjects />} />
          <Route path="/large-projects" element={<LargeProjects />} />
          <Route path="/server-api" element={<ServerAPI />} />
          <Route path="/signup" element={<SignApp />} />

          {/* DASHBOARD ROUTES (Nested) */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="build" element={<Build/>} />
            <Route path="pricing" element={<pricing/>} />
            <Route path="projects" element={<FreeProjects/>} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>

      <Footer />
    </Router>
  );
};

export default App;
