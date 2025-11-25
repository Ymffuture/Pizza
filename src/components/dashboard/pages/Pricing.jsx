import Blog from "../../NavBlog";
import { Outlet } from "react-router-dom";

export default function Pricing() {
  return (
    <div className="p-6 text-gray-900 dark:text-white">
      <h1 className="text-3xl font-bold mb-4">SwiftMeta</h1>

      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Explore our plans, features, and smart website-building tools.
      </p>

      {/* Blog nav */}
      <div className="mb-6">
        <Blog />
      </div>

      {/* Nested pages render here */}
      <div className="mt-4">
        <Outlet />
      </div>
    </div>
  );
}
