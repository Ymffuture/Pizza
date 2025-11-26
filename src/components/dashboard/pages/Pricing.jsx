// import Blog from "../../NavBlog";
import { Outlet, Link} from "react-router-dom";


export default function Pricing() {
  
  return (
    <div className="p-6 text-gray-900 dark:text-white">
      <h1 className="text-3xl font-bold mb-4">SwiftMeta</h1>

      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Explore our plans, features, and smart website-building tools.
      </p>

      {/* Blog nav */}
      
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 py-3 px-4 rounded-xl shadow-sm">
      <div className="max-w-4xl mx-auto flex justify-between items-center">
        
        <Link
          to="/"
          className="text-lg font-semibold text-gray-900 dark:text-white hover:opacity-80"
        >
          SwiftMeta Blog
        </Link>

        <div className="flex gap-4">
          <Link className="hover:text-blue-500" to="/dashboard/blog/login">Login</Link>
          <Link className="hover:text-blue-500" to="/dashboard/blog/register">Register</Link>
          <Link className="hover:text-blue-500" to="/dashboard/blog/new">New Post</Link>
          <Link className="hover:text-blue-500" to="/dashboard/blog/profile">Profile</Link>
        </div>
      </div>
    </nav>

      {/* Nested pages render here */}
      <div className="mt-4">
        <Outlet />
      </div>
    </div>
  );
}
