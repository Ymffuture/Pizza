import { Outlet, Link } from "react-router-dom";

export default function ApplicantLayout() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 transition-colors duration-300">
      {/* Simple applicant nav */}
      <header className="bg-white dark:bg-gray-800 shadow-md p-4 flex gap-6 fixed top-0 left-0 right-0 z-50 transition-colors duration-300">
        <Link
          to="/apply"
          className="font-medium text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          Apply
        </Link>
        <Link
          to="/apply/status"
          className="font-medium text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          Application Status
        </Link>
      </header>

      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
}
