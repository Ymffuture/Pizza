import React, { useEffect, lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { Helmet } from "react-helmet";
import { setToken } from "./api";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import CookieBanner from "./components/CookieBanner";
import ScrollToTop from "./components/ScrollToTop";

/* ============================= */
/* ========= LAZY LOAD ========= */
/* ============================= */

const Home = lazy(() => import("./Home"));
const NotFound = lazy(() => import("./pages/NotFound"));
const SignApp = lazy(() => import("./layouts/SignIn_Up"));
const About = lazy(() => import("./components/About"));
const Register = lazy(() => import("./pages/Register"));
const VerifyEmail = lazy(() => import("./pages/VerifyEmail"));
const LoginPhone = lazy(() => import("./pages/LoginPhone"));
const Feed = lazy(() => import("./pages/Feed"));
const NewPost = lazy(() => import("./pages/NewPost"));
const Profile = lazy(() => import("./pages/Profile"));
const Admin = lazy(() => import("./pages/Admin"));
const OnlyAdmin = lazy(() => import("./pages/OnlyAdmin"));
const News = lazy(() => import("./pages/News"));
const Mathq =lazy(() =>import("./components/Mathq"));
const Weather = lazy(() => import("./components/WeatherPage"));
const Policy = lazy(() => import("./pages/Policy"));
const Terms = lazy(() => import("./pages/Terms"));
const SmallProjects = lazy(() => import("./pages/SmallProjects"));
const LargeProjects = lazy(() => import("./pages/LargeProjects"));
const ServerAPI = lazy(() => import("./pages/ServerAPI"));

const Build = lazy(() => import("./components/dashboard/pages/Build"));
const Pricing = lazy(() => import("./components/dashboard/pages/Pricing"));
const FreeProjects = lazy(() => import("./components/dashboard/pages/FreeProjects"));
const DashboardLayout = lazy(() => import("./components/dashboard/DashboardLayout"));
const Dashboard = lazy(() => import("./components/dashboard/Dashboard"));

const Edit = lazy(() => import("./pages/EditPost"));
const ViewPost = lazy(() => import("./pages/ViewPost"));
const ResetPassword = lazy(() => import("./components/ResetPassword"));
const QuizPage = lazy(() => import("./pages/QuizPage"));
const QuizQuestion = lazy(() => import("./components/QuizQuestion"));
const VerifyEmailPage = lazy(() => import("./pages/VerifyEmailPage"));
const Contact = lazy(() => import("./components/Contact"));
const FAQ = lazy(() => import("./pages/FAQ"));
const HelpCenter = lazy(() => import("./pages/HelpCenter"));
const CreateTicket = lazy(() => import("./pages/CreateTicket"));
const TrackTicket = lazy(() => import("./pages/TrackTicket"));
const AdminTicket = lazy(() => import("./pages/AdminTicket"));

const ApplicantLayout = lazy(() => import("./pages/applicant/ApplicantLayout"));
const JobApply = lazy(() => import("./pages/applicant/JobApply"));
const ApplicationStatus = lazy(() => import("./pages/applicant/ApplicationStatus"));
const Subjects = lazy(() => import("./pages/applicant/SubjectsPricingPage"));
const AdminApplications = lazy(() => import("./pages/admin/AdminApplications"));
const SubjectsLayout = lazy(() => import("./pages/SubjectsLayout"));
const SubjectVideosPage = lazy(() => import("./pages/SubjectVideosPage"));
const DonationPage =lazy(() =>import("./components/DonationPage")) ;
/* ============================= */
/* ========= LOADER ============ */
/* ============================= */

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
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray="1, 200"
        strokeDashoffset="0"
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
        />
        <animate
          attributeName="opacity"
          values="1;0.5;1"
          dur="1.5s"
          repeatCount="indefinite"
        />
      </circle>
    </svg>
  </div>
);

/* ============================= */
/* ========= ADMIN GUARD ======= */
/* ============================= */

const isAdmin = () => true;

const AdminRoute = ({ children }) => {
  return isAdmin() ? children : <Navigate to="/apply" replace />;
};

/* ============================= */
/* ========= APP =============== */
/* ============================= */

const App = () => {
  useEffect(() => {
    const t = localStorage.getItem("token");
    setToken(t);
  }, []);

  return (
    <>
      <Helmet>
        <title>Home - SwiftMeta</title>
      </Helmet>

      <CookieBanner />

      <Router>
        <ScrollToTop />

        {/* Navbar renders instantly (no artificial loading) */}
        <Navbar />

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
            <Route path="/resetpassword" element={<ResetPassword />} />
            <Route path="/ticket" element={<CreateTicket />} />
            <Route path="/support" element={<CreateTicket />} />
            <Route path="/track" element={<TrackTicket />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/help" element={<HelpCenter />} />
            <Route path="/news" element={<News />} />
            <Route path="/pay-donation" element={<DonationPage />} />
            <Route path="/mathq" element={<Mathq />} />

            {/* Lessons */}
            <Route path="/lessons" element={<SubjectsLayout />}>
              <Route index element={<SubjectVideosPage />} />
              <Route path="Subject-to-register" element={<Subjects />} />
            </Route>

            {/* Applicant */}
            <Route path="/apply" element={<ApplicantLayout />}>
              <Route index element={<JobApply />} />
              <Route path="status" element={<ApplicationStatus />} />
            </Route>

            {/* Admin */}
            <Route
              path="/admin/applications"
              element={
                <AdminRoute>
                  <AdminApplications />
                </AdminRoute>
              }
            />
            <Route path="/admin-ticket" element={<AdminTicket />} />
            <Route path="/admin-only" element={<OnlyAdmin />} />

            {/* Dashboard */}
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="build" element={<Build />} />
              <Route path="projects" element={<FreeProjects />} />

              <Route path="blog" element={<Pricing />}>
                <Route path="feed" element={<Feed />} />
                <Route path="register" element={<Register />} />
                <Route path="verify-email" element={<VerifyEmail />} />
                <Route path="login" element={<LoginPhone />} />
                <Route path="new" element={<NewPost />} />
                <Route path="profile" element={<Profile />} />
                <Route path="edit/:id" element={<Edit />} />
                <Route path="posts/:id" element={<ViewPost />} />
              </Route>
            </Route>

            {/* 404 */}
            <Route path="*" element={<NotFound />} />

          </Routes>
        </Suspense>

        <Toaster position="bottom-left" />

        <Footer />
      </Router>
    </>
  );
};

export default App;
