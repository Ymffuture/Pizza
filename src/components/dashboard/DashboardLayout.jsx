import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

export default function DashboardLayout() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black pt-20 pb-20 md:pb-0">
      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-6">
          {/* <ProtectedRoute>
     
    </ProtectedRoute> */}
           <Outlet />
        </main>
      </div>
    </div>
  );
}
