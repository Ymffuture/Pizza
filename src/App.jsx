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

const Loader = () => (
  <div className="flex flex-col items-center justify-center min-h-screen">
    <p className="text-gray-500 mt-3">Loading page...</p>
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
            <Route path="build" element={<div>Build Website</div>} />
            <Route path="pricing" element={<div>Price Range</div>} />
            <Route path="projects" element={<div>Free Projects</div>} />
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
