// src/pages/NotFound.jsx
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white dark:bg-black flex flex-col items-center justify-center px-6 text-center">
      
      {/* Soft Apple-style glow behind text */}
      <div className="absolute w-[300px] h-[300px] bg-gradient-to-b from-gray-200 to-transparent dark:from-gray-800 blur-3xl opacity-40" />

      {/* 404 */}
      <h1 className="relative text-[120px] font-semibold text-gray-900 dark:text-gray-100 tracking-tight select-none">
        404
      </h1>

      {/* Message */}
      <p className="relative text-lg text-gray-600 dark:text-gray-400 mt-2 max-w-md">
        The page you're looking for doesn’t exist.  
      </p>

      {/* Apple-style subtle link */}
      <Link
        to="/"
        className="relative mt-6 text-blue-600 dark:text-blue-400 text-lg inline-flex items-center gap-2 hover:underline"
      >
        Go back home
        <ArrowRight size={20} />
      </Link>

      {/* Apple-style image placeholder */}
      <div className="relative mt-16">
        <div className="w-60 h-60 rounded-3xl bg-gray-100 dark:bg-gray-900 shadow-inner flex items-center justify-center">
          <p className="text-gray-400 dark:text-gray-600">No page found</p>
        </div>
      </div>
    </div>
  );
}
