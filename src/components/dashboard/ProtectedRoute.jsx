import { useEffect, useState } from "react";
import { supabase } from "../layouts/lib/supabaseClient";
import { Spin } from "antd";

export default function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);

  useEffect(() => {
    let ignore = false;

    async function checkAuth() {
      const { data } = await supabase.auth.getSession();
      if (!ignore) {
        setSession(data.session);
        setLoading(false);

        if (!data.session) {
          window.location.href = "/signin"; 
        }
      }
    }

    checkAuth();
    return () => { ignore = true };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen dark:bg-black">
        <Spin size="large" />
      </div>
    );
  }

  return children;
}
