import MainDashboard from "./DashboardLayout" ;

export default function Dashboard() {
  return (
    <div className="text-gray-900 dark:text-white">
      <h1 className="text-3xl font-bold mb-4">Welcome to your Dashboard</h1>
      <p className="text-gray-600 dark:text-gray-400">
        Select a feature from the sidebar to begin.
      </p>

      <MainDashboard />
    </div>
  );
}
