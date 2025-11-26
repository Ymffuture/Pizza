import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../layouts/lib/supabaseClient";
// import { Spin } from "antd";
import toast from "react-hot-toast";

export default function ProtectedRoute({ children }) {
  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const navigate = useNavigate();
  
const Loader = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-transparent">
    <svg
      width="90"
      height="90"
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      className="animate-spin text-gray-300 dark:text-gray-700"
    >
      <circle
        cx="50"
        cy="50"
        r="40"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
        fill="none"
        strokeDasharray="250"
        strokeDashoffset="180"
      />
      <circle cx="50" cy="50" r="10" fill="#00E5FF">
        <animate
          attributeName="r"
          values="10;14;10"
          dur="1.6s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="opacity"
          values="1;0.6;1"
          dur="1.6s"
          repeatCount="indefinite"
        />
      </circle>
    </svg>
    <p className="text-gray-500 dark:text-gray-400 mt-3 text-sm tracking-wide">
      Loading page...
    </p>
  </div>
);
  
  useEffect(() => {
    let unsubscribed = false;

    const checkUser = async () => {
      const { data } = await supabase.auth.getSession();

      if (unsubscribed) return;

      if (!data.session) {
        toast.error("Please sign in to continue", {
          id: "auth-warning",
        });

        navigate("/signup", { replace: true });
        return;
      }

      setAuthorized(true);
      setChecking(false);
    };

    checkUser();

    // Realtime listener (logout triggers redirect)
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        toast("You've been signed out", { icon: "🔒", id: "auth-signed-out" });
        navigate("/signup", { replace: true });
      }
    });

    return () => {
      unsubscribed = true;
      listener.subscription.unsubscribe();
    };
  }, [navigate]);

  if (checking) {
    return (
      <div className="flex items-center justify-center h-screen dark:bg-black transition-all duration-300">
        <Loader/>
      </div>
    );
  }

  return authorized ? children : null;
}
