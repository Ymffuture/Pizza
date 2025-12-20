import { useEffect, useState } from "react";
import { supabase } from "./layouts/lib/supabaseClient";
import toast from "react-hot-toast";
import { Lock } from "lucide-react";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true);
    });
  }, []);

  const updatePassword = async () => {
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Password updated. You can log in now.");
    }
  };

  if (!ready) {
    return <p className="text-center mt-20">Invalid or expired reset link</p>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-md w-full max-w-sm space-y-4">
        <h2 className="text-lg font-semibold text-center">Reset Password</h2>

        <div className="flex items-center border rounded-md px-3 h-11">
          <Lock size={18} className="text-gray-400" />
          <input
            type="password"
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="flex-1 outline-none bg-transparent text-sm ml-2"
          />
        </div>

        <button
          onClick={updatePassword}
          disabled={loading}
          className="w-full h-11 bg-blue-600 text-white rounded-md"
        >
          {loading ? "Updating…" : "Update Password"}
        </button>
      </div>
    </div>
  );
}
