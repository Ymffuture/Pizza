import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../layouts/lib/supabaseClient";
import { Spin } from "antd";
import toast from "react-hot-toast";

export default function ProtectedRoute({ children }) {
  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const navigate = useNavigate();

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
        <Spin size="large" />
      </div>
    );
  }

  return authorized ? children : null;
}
