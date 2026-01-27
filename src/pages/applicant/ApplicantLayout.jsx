import { Outlet, Link } from "react-router-dom";

export default function ApplicantLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Simple applicant nav */}
      <header className="bg-white shadow p-4 flex gap-4">
        <Link to="/apply" className="font-medium">
          Apply
        </Link>
        <Link to="/apply/status" className="font-medium">
          Application Status
        </Link>
      </header>

      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
}
