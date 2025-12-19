import { useEffect, useState } from "react";
import { supabase } from "./lib/supabaseClient";
import { useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { Mail, Lock } from "lucide-react";
import { FaGoogle, FaGithub } from "react-icons/fa";

export default function SignIn_Up() {
  const navigate = useNavigate();

  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState("");
  const [error, setError] = useState("");

  // ---------------------------
  // EMAIL AUTH (FIXED)
  // ---------------------------
  const handleAuth = async () => {
    setLoading(true);
    setError("");

    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/dashboard/blog`,
          },
        });
        if (error) throw error;

        alert("Check your email to confirm your account");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------
  // OAUTH (FIXED REDIRECT)
  // ---------------------------
  const loginWithProvider = async (provider) => {
    try {
      setSocialLoading(provider);
      setError("");

      await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/dashboard/blog`,
        },
      });
    } finally {
      setSocialLoading("");
    }
  };

  // ---------------------------
  // SESSION SYNC (THE REAL FIX)
  // ---------------------------
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user) {
        setUser(data.session.user);
        navigate("/dashboard/blog");
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
        navigate("/dashboard/blog");
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  // ---------------------------
  // LOGOUT
  // ---------------------------
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <>
      <Helmet>
        <title>Log in · SwiftMeta</title>
      </Helmet>

      <div className="min-h-screen flex items-center justify-center bg-[#f0f2f5] dark:bg-black px-4">
        <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-xl shadow-md border p-6">

          {error && (
            <div className="mb-4 text-sm text-red-600 bg-red-50 rounded-md px-3 py-2">
              {error}
            </div>
          )}

          {!user ? (
            <>
              {/* TABS */}
              <div className="flex mb-6 border-b">
                {["login", "signup"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setMode(tab)}
                    className={`flex-1 py-2 text-sm font-medium ${
                      mode === tab
                        ? "border-b-2 border-blue-600 text-blue-600"
                        : "text-gray-500"
                    }`}
                  >
                    {tab === "login" ? "Log In" : "Create Account"}
                  </button>
                ))}
              </div>

              {/* FORM */}
              <div className="space-y-4">
                <InputField icon={<Mail size={18} />} value={email} onChange={setEmail} placeholder="Email" />
                <InputField icon={<Lock size={18} />} value={password} onChange={setPassword} type="password" placeholder="Password" />

                <button
                  disabled={!email || !password || loading}
                  onClick={handleAuth}
                  className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-semibold"
                >
                  {loading ? "Please wait…" : mode === "login" ? "Log In" : "Create Account"}
                </button>
              </div>

              {/* OAUTH */}
              <div className="mt-6 space-y-3">
                <SocialButton icon={<FaGoogle />} label="Continue with Google" onClick={() => loginWithProvider("google")} loading={socialLoading === "google"} />
                <SocialButton icon={<FaGithub />} label="Continue with GitHub" onClick={() => loginWithProvider("github")} loading={socialLoading === "github"} />
              </div>
            </>
          ) : (
            <button onClick={handleLogout} className="w-full h-11 bg-red-500 text-white rounded-md">
              Logout
            </button>
          )}
        </div>
      </div>
    </>
  );
}

// ---------------------------
// COMPONENTS
// ---------------------------
function InputField({ icon, value, onChange, placeholder, type = "text" }) {
  return (
    <div className="flex items-center gap-2 border rounded-md px-3 h-11">
      {icon}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="flex-1 outline-none bg-transparent"
      />
    </div>
  );
}

function SocialButton({ icon, label, onClick, loading }) {
  return (
    <button onClick={onClick} disabled={loading} className="w-full h-11 border rounded-md flex gap-2 justify-center">
      {icon} {loading ? "Please wait…" : label}
    </button>
  );
}
