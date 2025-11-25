import Blog from "../../NavBlog";
import { Outlet } from "react-router-dom";
export default function Pricing() {
  return (
    <div className="p-6 text-gray-900 dark:text-white">
      <h1 className="text-3xl font-bold mb-4">SwiftMeta</h1>
      <p className="text-gray-600 dark:text-gray-400">
        
      <Blog/>

        <Outlet />
      </p>
    </div>
  );
}
