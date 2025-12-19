import { useEffect, useState } from "react";
import { supabase } from "./lib/supabaseClient";
import { useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { Mail, Lock, User, Image } from "lucide-react";
import { FaGoogle, FaGithub, FaApple } from "react-icons/fa";
import toast from "react-hot-toast";

const DEFAULT_AVATAR = "https://filebank.vercel.app/pp.jpeg";

export default function SignIn_Up() {
  const navigate = useNavigate();

  const [mode, setMode] = useState("login");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState("");
  const [error, setError] = useState("");
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

  /* ---------------------------
     OAUTH
  ---------------------------- */
  const loginWithProvider = async (provider) => {
    try {
      setSocialLoading(provider);
      await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo:
            "https://swiftmeta.vercel.app/dashboard/blog",
        },
      });
    } catch {
      toast.error("Social login failed");
    } finally {
      setSocialLoading("");
    }
  };

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
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
    });

    const { data: listener } =
      supabase.auth.onAuthStateChange((_e, session) => {
        setUser(session?.user ?? null);
        if (session?.user) navigate("/dashboard/blog");
      });

    return () => listener.subscription.unsubscribe();
  }, [navigate]);

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

          {sent && (
            <div className="mb-4 text-sm text-green-600 bg-green-50 rounded-md px-3 py-2">
              {sent}
            </div>
          )}

          {!user && (
            <>
              <div className="flex mb-6 border-b">
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
                        ? "border-b-2 border-blue-600 text-blue-600"
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

                    <label className="flex items-center gap-2 border rounded-md px-3 h-11 cursor-pointer text-sm text-gray-500">
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
                  className="w-full h-11 rounded-md bg-blue-600 text-white font-semibold"
                >
                  {loading
                    ? "Please wait…"
                    : mode === "login"
                    ? "Log In"
                    : "Create Account"}
                </button>
              </div>

              <div className="my-6 flex items-center gap-3 text-sm text-gray-400">
                <span className="flex-1 h-px bg-gray-300" />
                or
                <span className="flex-1 h-px bg-gray-300" />
              </div>

              <div className="space-y-3">
                <SocialButton
                  icon={<FaGoogle />}
                  label="Continue with Google"
                  loading={socialLoading === "google"}
                  onClick={() => loginWithProvider("google")}
                />

                <SocialButton
                  icon={<FaGithub />}
                  label="Continue with GitHub"
                  loading={socialLoading === "github"}
                  onClick={() => loginWithProvider("github")}
                />

                {/* APPLE UI BUTTON */}
                <button
                  onClick={loginWithApple}
                  disabled={socialLoading === "apple"}
                  className="w-full h-11 flex items-center justify-center gap-2 rounded-md bg-black text-white text-sm font-medium hover:bg-neutral-800 transition"
                >
                  <FaApple size={18} />
                  {socialLoading === "apple"
                    ? "Please wait…"
                    : "Continue with Apple"}
                </button>
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
    <div className="flex items-center gap-2 border rounded-md px-3 h-11 bg-gray-50">
      {icon && <span className="text-gray-400">{icon}</span>}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="flex-1 bg-transparent outline-none text-sm"
      />
    </div>
  );
}

function SocialButton({ icon, label, onClick, loading }) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="w-full h-11 flex items-center justify-center gap-2 border rounded-md text-sm font-medium"
    >
      {icon}
      {loading ? "Please wait…" : label}
    </button>
  );
}
