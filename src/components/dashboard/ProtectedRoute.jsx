import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../layouts/lib/supabaseClient";
import toast from "react-hot-toast";

const Loader = () => (
  <div className="flex flex-col items-center justify-center min-h-screen">
    <svg
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
    stroke-width="6"
    stroke-linecap="round"
    stroke-dasharray="1, 200"
    stroke-dashoffset="0"
  >
    <animate
      attributeName="stroke-dasharray"
      values="1,200;90,200;1,200"
      dur="1.5s"
      repeatCount="indefinite"
    />
    <animate
      attributeName="stroke-dashoffset"
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
            icon: "🔒",
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
