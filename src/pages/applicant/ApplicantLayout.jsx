import { Outlet, Link } from "react-router-dom";

export default function ApplicantLayout() {
  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Simple applicant nav */}
      <header className="bg-white shadow p-4 flex gap-4 fixed top-0 left-0 right-0 z-50">
        <Link to="/apply" className="font-medium hover:text-blue-600 transition">
          Apply
        </Link>
        <Link to="/apply/status" className="font-medium hover:text-blue-600 transition">
          Application Status
        </Link>
      </header>

      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
}
