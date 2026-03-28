import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../layouts/lib/supabaseClient";
import toast from "react-hot-toast";

// ✅ FIX: SVG attributes were in HTML kebab-case, not JSX camelCase.
// React silently drops kebab-case SVG attributes, so the spinner rendered
// as a static broken circle with zero animation.
const Loader = () => (
  <div className="flex flex-col items-center justify-center min-h-screen">
    <svg
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      width="64"
      height="64"
      role="progressbar"
      aria-busy="true"
    >
      <circle
        cx="50"
        cy="50"
        r="40"
        fill="none"
        stroke="#1a73e8"
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray="1, 200"
        strokeDashoffset="0"
      >
        <animate
          attributeName="strokeDasharray"
          values="1,200;90,200;1,200"
          dur="1.5s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="strokeDashoffset"
          values="0;-40;-120"
          dur="1.5s"
          repeatCount="indefinite"
        />
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 50 50"
          to="360 50 50"
          dur="2s"
          repeatCount="indefinite"
        />
      </circle>

      <circle cx="50" cy="50" r="8" fill="#1a73e8">
        <animate
          attributeName="r"
          values="8;12;8"
          dur="1.5s"
          repeatCount="indefinite"
          keySplines="0.4 0 0.2 1"
          calcMode="spline"
        />
        <animate
          attributeName="opacity"
          values="1;0.5;1"
          dur="1.5s"
          repeatCount="indefinite"
        />
      </circle>
    </svg>

    <p className="mt-3 text-sm text-gray-500 dark:text-gray-400 animate-pulse">
      Loading…
    </p>
  </div>
);

export default function ProtectedRoute({ children }) {
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let mounted = true;

    const hydrateSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;

      if (data?.session) {
        setStatus("authenticated");
      } else {
        setStatus("unauthenticated");
        navigate("/signup", { replace: true });
      }
    };

    hydrateSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!session) {
          toast("You've been signed out", { icon: "🔒", id: "signed-out" });
          setStatus("unauthenticated");
          navigate("/signup", { replace: true });
        }
      }
    );

    return () => {
      mounted = false;
      authListener.subscription.unsubscribe();
    };
  }, [navigate]);

  if (status === "loading") {
    return (
      <div className="h-screen bg-[#f5f5f7] dark:bg-black">
        <Loader />
      </div>
    );
  }

  if (status === "authenticated") return children;

  return null;
}
