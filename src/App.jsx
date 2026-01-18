import React, { useState, useEffect, lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Skeleton } from "antd";
import toast, { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import NotFound from "./pages/NotFound";
import SignApp from "./layouts/SignIn_Up";
import About from "./components/About" ;
import Register from "./pages/Register";
import VerifyEmail from "./pages/VerifyEmail";
import LoginPhone from "./pages/LoginPhone";
import Feed from "./pages/Feed";
import NewPost from "./pages/NewPost";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin" ;
import ScrollToTop from "./components/ScrollToTop";
// import RoutesConfig from "./RoutesConfig";
import {Helmet} from "react-helmet" 
//import NavBlog from "./components/NavBlog";
import { setToken } from "./api";

import DashboardLayout from "./components/dashboard/DashboardLayout";
import Dashboard from "./components/dashboard/Dashboard";
const Weather =lazy(() =>import("./components/WeatherPage")) ;
const Policy = lazy(() => import("./pages/Policy"));
const Terms = lazy(() => import("./pages/Terms"));
const SmallProjects = lazy(() => import("./pages/SmallProjects"));
const LargeProjects = lazy(() => import("./pages/LargeProjects"));
const ServerAPI = lazy(() => import("./pages/ServerAPI"));
const Home = lazy(() => import("./Home"));
const Build = lazy(() => import("./components/dashboard/pages/Build"));
const Pricing = lazy(() => import("./components/dashboard/pages/Pricing"));
const FreeProjects = lazy(() => import("./components/dashboard/pages/FreeProjects"));
const Edit =lazy(() =>import("./pages/EditPost")) ;
const ViewPost = lazy(() => import("./pages/ViewPost")) ;
const ResetPassword =lazy(() =>import("./components/ResetPassword")) ;
const QuizPage = lazy(() => import("./pages/QuizPage")) ;
const QuizQuestion =lazy(() =>import("./components/QuizQuestion")) ;
const VerifyEmailPage =lazy(() =>import("./pages/VerifyEmailPage"));
const Contact =lazy(() =>import("./components/Contact")) ;
const FAQ = lazy(() =>import("./pages/FAQ"));
const HelpCenter =lazy(() =>import("./pages/HelpCenter")) ;
const CreateTicket =lazy(() =>import("./pages/CreateTicket")) ;
const TrackTicket =lazy(() =>import("./pages/TrackTicket")) ;
const AdminTicket =lazy(() =>import("./pages/AdminTicket")) ;






const Loader = () => (
  <div className="flex flex-col items-center justify-center bg-transparent">
    <svg
  viewBox="0 0 100 100"
  xmlns="http://www.w3.org/2000/svg"
  width="64"
  height="64"
  role="progressbar"
  aria-busy="true"
>
  
  <circle
    cx="50"
    cy="50"
    r="40"
    fill="none"
    stroke="#1a73e8"
    stroke-width="6"
    stroke-linecap="round"
    stroke-dasharray="1, 200"
    stroke-dashoffset="0"
  >
    <animate
      attributeName="stroke-dasharray"
      values="1,200;90,200;1,200"
      dur="1.5s"
      repeatCount="indefinite"
    />
    <animate
      attributeName="stroke-dashoffset"
      values="0;-40;-120"
      dur="1.5s"
      repeatCount="indefinite"
    />
    <animateTransform
      attributeName="transform"
      type="rotate"
      from="0 50 50"
      to="360 50 50"
      dur="2s"
      repeatCount="indefinite"
    />
  </circle>

  
  <circle cx="50" cy="50" r="8" fill="#1a73e8">
    <animate
      attributeName="r"
      values="8;12;8"
      dur="1.5s"
      repeatCount="indefinite"
      keySplines="0.4 0 0.2 1"
      calcMode="spline"
    />
    <animate
      attributeName="opacity"
      values="1;0.5;1"
      dur="1.5s"
      repeatCount="indefinite"
    />
  </circle>
</svg>
    <p className="text-gray-500 dark:text-gray-400 mt-3 text-sm tracking-wide animate-fadeIn">
      
    </p>
  </div>
);

const App = () => {
  const [navbarLoading, setNavbarLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setNavbarLoading(false), 800);
  }, []);

  useEffect(() => {
    const t = localStorage.getItem("token");
    setToken(t);
  }, []);

  return (
    <Router>
      
      <ScrollToTop />
      {navbarLoading ? (
        <Skeleton active paragraph={{ rows: 2 }} />
      ) : (
        <Navbar />
      )}

      <Suspense fallback={<Loader />}>
        <Routes>
          {/* PUBLIC */}
          <Route path="/" element={<Home />} />
          <Route path="/policy" element={<Policy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/small-projects" element={<SmallProjects />} />
          <Route path="/large-projects" element={<LargeProjects />} />
          <Route path="/server-api" element={<ServerAPI />} />
          <Route path="/signup" element={<SignApp />} />
          <Route path="/weather" element={<Weather />} />
          <Route path="/about" element={<About />} />
          <Route path="/quiz-question" element={<QuizQuestion />} />
          <Route path="/start-quiz" element={<QuizPage />} />
          <Route path="/verify" element={<VerifyEmailPage />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/resetpassword" element={<ResetPassword/>} />
          <Route path="/ticket" element={<CreateTicket />} />
          <Route path="/support" element={<CreateTicket />} />
         <Route path="/track" element={<TrackTicket />} />
         <Route path="/faq" element={<FAQ />} />
         <Route path="/help" element={<HelpCenter />} />
        {/* Admin Route (JWT guard later) */}
        <Route path="/admin-ticket" element={<AdminTicket />} />

          
          {/* DASHBOARD */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="build" element={<Build />} />
            <Route path="projects" element={<FreeProjects />} />

            {/* NESTED ROUTES INSIDE PRICING */}
            <Route path="blog" element={<Pricing />}>
              <Route path="feed" element={<Feed />} />
              <Route path="register" element={<Register />} />
              <Route path="verify-email" element={<VerifyEmail />} />
              <Route path="login" element={<LoginPhone />} />
              <Route path="new" element={<NewPost />} />
              <Route path="profile" element={<Profile />} />
              <Route path="edit/:id" element={<Edit />} />
              <Route path="posts/:id" element={<ViewPost/>} />
            </Route>
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
<Toaster
  position="bottom-left"
  toastOptions={{
    style: {
      borderRadius: "10px",
      padding: "10px 16px",
      // Auto-theme: Detect browser dark mode
      background: window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "rgba(20,20,20,0.92)"
        : "rgba(255,255,255,0.92)",
      color: window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "#fff"
        : "#111",
      backdropFilter: "blur(12px)", // smooth frosted effect
      boxShadow:
        "0 8px 22px rgba(0,0,0,0.18), 0 3px 8px rgba(0,0,0,0.12)", // floating shadow
      border: window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "1px solid rgba(255,255,255,0.1)"
        : "1px solid rgba(0,0,0,0.08)",
    },
    duration: 5000,
  }}
/>

      <Footer />
      
    </Router>
    
  );
};

export default App;
