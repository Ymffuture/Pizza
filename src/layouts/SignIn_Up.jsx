import { useEffect, useState } from "react";
import { supabase } from "./lib/supabaseClient";
import { useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet";
<<<<<<< HEAD
import { Mail, Lock } from "lucide-react";
import { FaGoogle, FaGithub } from "react-icons/fa";
=======
import { Mail, Lock, User, Image } from "lucide-react";
import { FaGoogle, FaGithub, FaApple } from "react-icons/fa";
import toast from "react-hot-toast";

const DEFAULT_AVATAR = "https://filebank.vercel.app/pp.jpeg";
>>>>>>> a1f812244aa98a624e6dcfc663437e3bfa12c954

export default function SignIn_Up() {
  const navigate = useNavigate();

<<<<<<< HEAD
  const [mode, setMode] = useState("login"); // login | signup
=======
  const [mode, setMode] = useState("login");
  const [username, setUsername] = useState("");
>>>>>>> a1f812244aa98a624e6dcfc663437e3bfa12c954
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState("");
  const [error, setError] = useState("");
<<<<<<< HEAD

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
=======
  const [sent, setSent] = useState("");

  /* ---------------------------
     AVATAR UPLOAD
  ---------------------------- */
  const uploadAvatar = async (file, userId) => {
    const ext = file.name.split(".").pop();
    const filePath = `${userId}.${ext}`;

    const { error } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, { upsert: true });

    if (error) throw error;

    const { data } = supabase.storage
      .from("avatars")
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  /* ---------------------------
     EMAIL AUTH
  ---------------------------- */
  const handleAuth = async () => {
    if (!email) return setError("Email is required");
    if (!password) return setError("Password is required");
    if (mode === "signup" && !username)
      return setError("Username is required");

    setLoading(true);
    setError("");
    setSent("");

    try {
      let result;
>>>>>>> a1f812244aa98a624e6dcfc663437e3bfa12c954

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
              username,
              avatar: DEFAULT_AVATAR,
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

      if (mode === "signup" && avatarFile) {
        const avatarUrl = await uploadAvatar(
          avatarFile,
          data.user.id
        );

        await supabase.auth.updateUser({
          data: { avatar: avatarUrl },
        });
      }

      toast.success(
        mode === "login" ? "Welcome back!" : "Account created!"
      );

      setUser(data.user);
      navigate("/dashboard/blog");
    } catch (err) {
      setSent("");
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

<<<<<<< HEAD
  const loginWithProvider = async (provider) => {
    try {
      setSocialLoading(provider);
      setError("");

=======
  /* ---------------------------
     OAUTH
  ---------------------------- */
  const loginWithProvider = async (provider) => {
    try {
      setSocialLoading(provider);
>>>>>>> a1f812244aa98a624e6dcfc663437e3bfa12c954
      await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo:
            "https://swiftmeta.vercel.app/dashboard/blog",
        },
      });
<<<<<<< HEAD
=======
    } catch {
      toast.error("Social login failed");
>>>>>>> a1f812244aa98a624e6dcfc663437e3bfa12c954
    } finally {
      setSocialLoading("");
    }
  };

<<<<<<< HEAD
  const handleLogout = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    setUser(null);
    setLoading(false);
  };

  // ---------------------------
  // SESSION SYNC (Facebook-like)
  // ---------------------------
=======
  const loginWithApple = async () => {
    try {
      setSocialLoading("apple");
      await supabase.auth.signInWithOAuth({
        provider: "apple",
        options: {
          redirectTo:
            "https://swiftmeta.vercel.app/dashboard/blog",
        },
      });
    } catch {
      toast.error("Apple login failed");
    } finally {
      setSocialLoading("");
    }
  };

  /* ---------------------------
     SESSION SYNC
  ---------------------------- */
>>>>>>> a1f812244aa98a624e6dcfc663437e3bfa12c954
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
    });

<<<<<<< HEAD
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => setUser(session?.user ?? null)
    );
=======
    const { data: listener } =
      supabase.auth.onAuthStateChange((_e, session) => {
        setUser(session?.user ?? null);
        if (session?.user) navigate("/dashboard/blog");
      });
>>>>>>> a1f812244aa98a624e6dcfc663437e3bfa12c954

    return () => listener.subscription.unsubscribe();
  }, [navigate]);

  return (
    <>
      <Helmet>
        <title>Log in · SwiftMeta</title>
      </Helmet>

      <div className="min-h-screen flex items-center justify-center bg-[#f0f2f5] dark:bg-black px-4">
<<<<<<< HEAD
        <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-xl shadow-md border border-gray-200 dark:border-gray-800 p-6">
          
          {/* ERROR */}
          {error && (
            <div className="mb-4 text-sm text-red-600 bg-red-50 dark:bg-red-500/10 rounded-md px-3 py-2">
=======
        <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-xl shadow-m p-6">

          {error && (
            <div className="mb-4 text-sm text-red-600 bg-red-500/10 rounded-md px-3 py-2">
>>>>>>> a1f812244aa98a624e6dcfc663437e3bfa12c954
              {error}
            </div>
          )}

<<<<<<< HEAD
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
=======
          {sent && (
            <div className="mb-4 text-sm text-green-600 bg-green-500/10 rounded-md px-3 py-2">
              {sent}
            </div>
          )}

          {!user && (
            <>
              <div className="flex mb-6">
                {["login", "signup"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => {
                      setMode(tab);
                      setError("");
                      setUsername("");
                      setAvatarFile(null);
                    }}
                    className={`flex-1 py-2 text-sm font-medium ${
                      mode === tab
                        ? "border-b-4 border-blue-600 text-blue-600"
                        : "text-gray-500"
                    }`}
                  >
                    {tab === "login" ? "Log In" : "Create Account"}
                  </button>
                ))}
              </div>

              <div className="space-y-4">
                {mode === "signup" && (
                  <>
                    <InputField
                      icon={<User size={18} />}
                      placeholder="Username"
                      value={username}
                      onChange={setUsername}
                    />

                    <label className="flex items-center gap-2 rounded-md px-3 h-11 cursor-pointer text-sm text-gray-500">
                      <Image size={18} />
                      <span>
                        {avatarFile
                          ? avatarFile.name
                          : "Upload avatar (optional)"}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={(e) =>
                          setAvatarFile(e.target.files[0])
                        }
                      />
                    </label>
                  </>
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
                  className="w-full h-11 rounded-md bg-[#202124] text-white font-semibold"
>>>>>>> a1f812244aa98a624e6dcfc663437e3bfa12c954
                >
                  {loading
                    ? "Please wait…"
                    : mode === "login"
                    ? "Log In"
                    : "Create Account"}
                </button>
              </div>

<<<<<<< HEAD
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
=======
              <div className="my-6 flex items-center gap-3 text-sm text-gray-400">
                <span className="flex-1 h-px bg-gray-300" />
                or
                <span className="flex-1 h-px bg-gray-300" />
              </div>

              <div className="space-y-3 dark:text-white">
                <SocialButton
                  icon={<FaGoogle />}
                  label="Continue with Google"
                  loading={socialLoading === "google"}
                  onClick={() => loginWithProvider("google")}
                  className="w-full h-11 flex items-center justify-center gap-2 rounded-md bg-red-500 text-white text-sm font-medium hover:bg-neutral-800 transition"
                />

                <SocialButton
                  icon={<FaGithub />}
                  label="Continue with GitHub"
                  loading={socialLoading === "github"}
                  onClick={() => loginWithProvider("github")}
                  className="w-full h-11 flex items-center justify-center gap-2 rounded-md bg-black text-white text-sm font-medium hover:bg-neutral-800 transition"
                />

                {/* APPLE UI BUTTON 
                <button
                  onClick={loginWithApple}
                  disabled={socialLoading === "apple"}
                  className="w-full h-11 flex items-center justify-center gap-2 rounded-md bg-black text-white text-sm font-medium hover:bg-neutral-800 transition"
                >
                  <FaApple size={18} />
                  {socialLoading === "apple"
                    ? "Please wait…"
                    : "Continue with Apple( is disable) "}
                </button>
                */} 
>>>>>>> a1f812244aa98a624e6dcfc663437e3bfa12c954
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

/* ---------------------------
<<<<<<< HEAD
   REUSABLE INPUT
---------------------------- */
function InputField({ icon, value, onChange, placeholder, type = "text" }) {
  return (
    <div className="flex items-center gap-2 border border-gray-300 dark:border-gray-700 rounded-md px-3 h-11 bg-gray-50 dark:bg-gray-800">
      <span className="text-gray-400">{icon}</span>
=======
   INPUT
---------------------------- */
function InputField({ icon, value, onChange, placeholder, type = "text" }) {
  return (
    <div className="flex items-center gap-2 border rounded-md px-3 h-11 bg-gray-50">
      {icon && <span className="text-gray-400">{icon}</span>}
>>>>>>> a1f812244aa98a624e6dcfc663437e3bfa12c954
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
<<<<<<< HEAD
        className="flex-1 bg-transparent outline-none text-sm text-gray-900 dark:text-white"
=======
        className="flex-1 bg-transparent outline-none text-sm"
>>>>>>> a1f812244aa98a624e6dcfc663437e3bfa12c954
      />
    </div>
  );
}

function SocialButton({ icon, label, onClick, loading }) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
<<<<<<< HEAD
      className="
        w-full h-11 flex items-center justify-center gap-2
        border border-gray-300 dark:border-gray-700
        rounded-md text-sm font-medium
        hover:bg-gray-50 dark:hover:bg-gray-800
        transition
      "
=======
      className="w-full h-11 flex items-center justify-center gap-2 border rounded-md text-sm font-medium"
>>>>>>> a1f812244aa98a624e6dcfc663437e3bfa12c954
    >
      {icon}
      {loading ? "Please wait…" : label}
    </button>
  );
}
