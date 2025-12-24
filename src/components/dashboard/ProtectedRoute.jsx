import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../layouts/lib/supabaseClient";
import toast from "react-hot-toast";

const Loader = () => (
  <div className="flex flex-col items-center justify-center min-h-screen">
    <svg
      width="72"
      height="72"
      viewBox="0 0 100 100"
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
    </svg>

    <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
      Loading…
    </p>
  </div>
);

export default function ProtectedRoute({ children }) {
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading");
  // status: "loading" | "authenticated" | "unauthenticated"

  useEffect(() => {
    let mounted = true;

    // 1️⃣ Initial session hydration
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

    // 2️⃣ Realtime auth changes (Facebook behavior)
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!session) {
          toast("You’ve been signed out", {
<<<<<<< HEAD
            icon: "",
=======
            icon: "🔒",
>>>>>>> a1f812244aa98a624e6dcfc663437e3bfa12c954
            id: "signed-out",
          });
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

  // 3️⃣ Loading shell (no UI leak)
  if (status === "loading") {
    return (
      <div className="h-screen bg-[#f5f5f7] dark:bg-black">
        <Loader />
      </div>
    );
  }

  // 4️⃣ Authenticated only
  if (status === "authenticated") {
    return children;
  }

  // 5️⃣ Unauthenticated (redirect already happened)
  return null;
}
