import { useEffect, useState } from "react";
import { supabase } from "./lib/supabaseClient";
import { useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { Mail, Lock } from "lucide-react";
import { FaGoogle, FaGithub } from "react-icons/fa";
import toast from "react-hot-toast";

export default function SignIn_Up() {
  const navigate = useNavigate();

  const [mode, setMode] = useState("login");
  const [username, setUsername] = useState(""); // ✅ NEW
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState("");
  const [error, setError] = useState("");
const [sent, setSent] = useState("");
  // ---------------------------
  // EMAIL AUTH
  // ---------------------------
  const handleAuth = async () => {
    if (!email || !password || (mode === "signup" && !username)) {
      setError("All fields are required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      let result;

      if (mode === "login") {
        result = await supabase.auth.signInWithPassword({
          email,
          password,
        });
      } else {
        result = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              username, // ✅ stored in user_metadata
            },
          },
        });
      }

      const { data, error } = result;
      if (error) throw error;

      if (mode === "signup" && !data.session) {
        setSent("Account created! Check your email to verify.");
        return;
      }

      toast.success(mode === "login" ? "Welcome back!" : "Account created!");
      setUser(data.user);
      navigate("/dashboard/blog");
    } catch (err) {
      setError(err.message);
      // toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------
  // OAUTH LOGIN
  // ---------------------------
  const loginWithProvider = async (provider) => {
    try {
      setSocialLoading(provider);
      setError("");

      await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: "https://swiftmeta.vercel.app/dashboard/blog",
        },
      });
    } catch {
      toast.error("Social login failed");
    } finally {
      setSocialLoading("");
    }
  };

  // ---------------------------
  // LOGOUT
  // ---------------------------
  const handleLogout = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    setUser(null);
    toast("Logged out");
    setLoading(false);
  };

  // ---------------------------
  // SESSION SYNC
  // ---------------------------
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) navigate("/dashboard/blog");
      }
    );

    return () => listener.subscription.unsubscribe();
  }, [navigate]);

  return (
    <>
      <Helmet>
        <title>Log in · SwiftMeta</title>
      </Helmet>

      <div className="min-h-screen flex items-center justify-center bg-[#f0f2f5] dark:bg-black px-4">
        <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-xl shadow-md border border-gray-200 dark:border-gray-800 p-6">

          {error && (
            <div className={`mb-4 text-sm ${!error? "text-green-600 bg-green-50 dark:bg-green-500/10 " : "text-red-600 bg-red-50 dark:bg-red-500/10"} rounded-md px-3 py-2`} >
              {error && sent} 
            </div>
          )}

          {!user ? (
            <>
              {/* TABS */}
              <div className="flex mb-6 border-b border-gray-200 dark:border-gray-800">
                {["login", "signup"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => {
                      setMode(tab);
                      setError("");
                      setUsername("");
                    }}
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
                {mode === "signup" && (
                  <InputField
                    placeholder="Username"
                    value={username}
                    onChange={setUsername}
                  />
                )}

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
                  disabled={loading}
                  onClick={handleAuth}
                  className="w-full h-11 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-semibold disabled:opacity-50 transition"
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
                  icon={<FaGoogle size={20} />}
                  label="Continue with Google"
                  loading={socialLoading === "google"}
                  onClick={() => loginWithProvider("google")}
                />

                <SocialButton
                  icon={<FaGithub size={20} />}
                  label="Continue with GitHub"
                  loading={socialLoading === "github"}
                  onClick={() => loginWithProvider("github")}
                />
              </div>
            </>
          ) : (
            <>
              <div className="text-center space-y-4 py-6">
                <p className="text-gray-800 dark:text-gray-200">
                  Logged in as{" "}
                  <strong>
                    {user.user_metadata?.username || user.email}
                  </strong>
                </p>

                <button
                  onClick={handleLogout}
                  className="w-full h-11 rounded-md bg-red-500 text-white font-medium"
                >
                  Logout
                </button>

                <Link
                  to="/dashboard/blog"
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
   INPUT
---------------------------- */
function InputField({ icon, value, onChange, placeholder, type = "text" }) {
  return (
    <div className="flex items-center gap-2 border border-gray-300 dark:border-gray-700 rounded-md px-3 h-11 bg-gray-50 dark:bg-gray-800">
      {icon && <span className="text-gray-400">{icon}</span>}
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
      className="w-full h-11 flex items-center justify-center gap-2 border border-gray-300 dark:border-gray-700 rounded-md text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition"
    >
      {icon}
      {loading ? "Please wait…" : label}
    </button>
  );
}
