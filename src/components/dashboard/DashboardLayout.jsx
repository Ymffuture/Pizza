import { Helmet } from "react-helmet";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

export default function DashboardLayout() {
  return (
    <>
      {/* SEO for dashboard (indexable only if you want it to be) */}
      <Helmet>
        <title>Dashboard | SwiftMeta</title>
        <meta
          name="description"
          content="SwiftMeta dashboard to build, manage, and deploy AI-powered websites."
        />
        <meta name="robots" content="noindex, nofollow" />
        <link
          rel="canonical"
          href="https://swiftmeta.vercel.app/dashboard"
        />
      </Helmet>

      <div className="min-h-screen bg-gray-50 dark:bg-black pt-20 pb-20 md:pb-0">
        <div className="flex">
          <Sidebar />

          {/* Semantic main content */}
          <main
            id="main-content"
            role="main"
            className="flex-1 p-6 focus:outline-none"
          >
            <ProtectedRoute>
              <Outlet />
            </ProtectedRoute>
          </main>
        </div>
      </div>
    </>
  );
}
