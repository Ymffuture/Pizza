import { useEffect, useState } from "react";
import { supabase } from "./lib/supabaseClient";
import { useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { Mail, Lock } from "lucide-react";
import { FaGoogle, FaGithub } from "react-icons/fa";

export default function SignIn_Up() {
  const navigate = useNavigate();

  const [mode, setMode] = useState("login"); // login | signup
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState("");
  const [error, setError] = useState("");

  // ---------------------------
  // AUTH ACTIONS
  // ---------------------------
  const handleAuth = async () => {
    setLoading(true);
    setError("");

    const fn =
      mode === "login"
        ? supabase.auth.signInWithPassword
        : supabase.auth.signUp;

    const { data, error } = await fn({ email, password });

    setLoading(false);
    if (error) return setError(error.message);

    setUser(data.user ?? null);
    navigate("/dashboard/blog");
  };

  const loginWithProvider = async (provider) => {
    try {
      setSocialLoading(provider);
      setError("");

      await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: "https://swiftmeta.vercel.app/dashboard",
        },
      });
    } finally {
      setSocialLoading("");
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    setUser(null);
    setLoading(false);
  };

  // ---------------------------
  // SESSION SYNC (Facebook-like)
  // ---------------------------
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => setUser(session?.user ?? null)
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  return (
    <>
      <Helmet>
        <title>Log in · SwiftMeta</title>
      </Helmet>

      <div className="min-h-screen flex items-center justify-center bg-[#f0f2f5] dark:bg-black px-4">
        <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-xl shadow-md border border-gray-200 dark:border-gray-800 p-6">
          
          {/* ERROR */}
          {error && (
            <div className="mb-4 text-sm text-red-600 bg-red-50 dark:bg-red-500/10 rounded-md px-3 py-2">
              {error}
            </div>
          )}

          {!user ? (
            <>
              {/* TABS */}
              <div className="flex mb-6 border-b border-gray-200 dark:border-gray-800">
                {["login", "signup"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setMode(tab)}
                    className={`
                      flex-1 py-2 text-sm font-medium
                      ${
                        mode === tab
                          ? "border-b-2 border-blue-600 text-blue-600"
                          : "text-gray-500"
                      }
                    `}
                  >
                    {tab === "login" ? "Log In" : "Create Account"}
                  </button>
                ))}
              </div>

              {/* FORM */}
              <div className="space-y-4">
                <InputField
                  icon={<Mail size={18} />}
                  placeholder="Email address"
                  value={email}
                  onChange={setEmail}
                />

                <InputField
                  icon={<Lock size={18} />}
                  placeholder="Password"
                  type="password"
                  value={password}
                  onChange={setPassword}
                />

                <button
                  disabled={!email || !password || loading}
                  onClick={handleAuth}
                  className="
                    w-full h-11 rounded-md
                    bg-blue-600 hover:bg-blue-700
                    text-white font-semibold
                    disabled:opacity-50
                    transition
                  "
                >
                  {loading
                    ? "Please wait…"
                    : mode === "login"
                    ? "Log In"
                    : "Create Account"}
                </button>
              </div>

              {/* DIVIDER */}
              <div className="my-6 flex items-center gap-3 text-sm text-gray-400">
                <span className="flex-1 h-px bg-gray-300 dark:bg-gray-700" />
                or
                <span className="flex-1 h-px bg-gray-300 dark:bg-gray-700" />
              </div>

              {/* SOCIAL */}
              <div className="space-y-3 dark:text-white">
                <SocialButton
                  icon={<FaGoogle  size={20}/>}
                  label="Continue with Google"
                  loading={socialLoading === "google"}
                  onClick={() => loginWithProvider("google")}
                />

                <SocialButton
                  icon={<FaGithub  size={20}/>}
                  label="Continue with GitHub"
                  loading={socialLoading === "github"}
                  onClick={() => loginWithProvider("github")}
                />
              </div>

              {/* TERMS */}
              <p className="text-xs text-center text-gray-500 mt-6">
                By continuing, you agree to SwiftMeta’s{" "}
                <Link to="/terms" className="text-blue-600">
                  Terms
                </Link>{" "}
                and{" "}
                <Link to="/privacy" className="text-blue-600">
                  Privacy Policy
                </Link>
              </p>
            </>
          ) : (
            <>
              {/* LOGGED IN */}
              <div className="text-center space-y-4 py-6">
                <p className="text-gray-800 dark:text-gray-200">
                  Logged in as <strong>{user.email}</strong>
                </p>

                <button
                  onClick={handleLogout}
                  className="w-full h-11 rounded-md bg-red-500 text-white font-medium"
                >
                  Logout
                </button>

                <Link
                  to="/dashboard"
                  className="block w-full h-11 rounded-md bg-black dark:bg-white text-white dark:text-black text-center leading-[44px] font-medium"
                >
                  Go to Dashboard
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

/* ---------------------------
   REUSABLE INPUT
---------------------------- */
function InputField({ icon, value, onChange, placeholder, type = "text" }) {
  return (
    <div className="flex items-center gap-2 border border-gray-300 dark:border-gray-700 rounded-md px-3 h-11 bg-gray-50 dark:bg-gray-800">
      <span className="text-gray-400">{icon}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="flex-1 bg-transparent outline-none text-sm text-gray-900 dark:text-white"
      />
    </div>
  );
}

function SocialButton({ icon, label, onClick, loading }) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="
        w-full h-11 flex items-center justify-center gap-2
        border border-gray-300 dark:border-gray-700
        rounded-md text-sm font-medium
        hover:bg-gray-50 dark:hover:bg-gray-800
        transition
      "
    >
      {icon}
      {loading ? "Please wait…" : label}
    </button>
  );
}
