import { useEffect, useState } from "react";
import { supabase } from "./lib/supabaseClient";
import {
  Input,
  Button,
  Alert,
  Card,
  Tabs,
  Divider,
} from "antd";
import {
  MailOutlined,
  LockOutlined,
  GoogleOutlined,
  GithubOutlined,
  FacebookOutlined,
} from "@ant-design/icons";
import { SiSpotify } from "react-icons/si";
import { useNavigate, Link} from "react-router-dom";
const { TabPane } = Tabs;

export default function SignIn_Up() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState("");

  // ------------------------------------
  // EMAIL SIGN UP
  // ------------------------------------
  const handleSignUp = async () => {
    setError("");
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({ email, password });

    setLoading(false);
    if (error) return setError(error.message);

    setUser(data.user ?? null);
    navigate("/dashboard");
  };

  // ------------------------------------
  // EMAIL LOGIN
  // ------------------------------------
  const handleLogin = async () => {
    setError("");
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);
    if (error) return setError(error.message);

    setUser(data.user ?? null);
    navigate("/dashboard/blog");
  };

  // ------------------------------------
  // SOCIAL LOGIN
  // ------------------------------------
  const loginWithProvider = async (provider) => {
    try {
      setSocialLoading(provider);
      setError("");

      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: "https://swiftmeta.vercel.app/dashboard",
        },
      });

      if (error) setError(error.message);
    } finally {
      setSocialLoading("");
    }
  };

  // ------------------------------------
  // LOG OUT
  // ------------------------------------
  const handleLogOut = async () => {
    setError("");
    setLoading(true);

    const { error } = await supabase.auth.signOut();

    setLoading(false);
    if (error) return setError(error.message);

    setUser(null);
  };

  // ------------------------------------
  // SESSION LISTENER
  // ------------------------------------
  useEffect(() => {
    const init = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      setUser(session?.user ?? null);
    };

    init();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => setUser(session?.user ?? null)
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  // ------------------------------------
  // UI
  // ------------------------------------
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-100 dark:bg-black">
      <Card
        className="w-full max-w-md shadow-xl rounded-2xl border border-gray-300 dark:border-white/10 dark:bg-gray-900/80 backdrop-blur-xl"
        style={{ borderRadius: "20px" }}
      >
        <span className="text-blue-500 dark:text-blue-600">Swift</span>
            <span className="text-gray-700 dark:text-gray-300">Meta™</span>

        {error && (
          <Alert
            message={error}
            type="error"
            showIcon
            className="mb-4 rounded-lg"
          />
        )}

        {!user ? (
          <>
            <Tabs defaultActiveKey="login" centered tabBarStyle={{ marginBottom: 30 }}>
              {/* LOGIN TAB */}
              <TabPane tab="Login" key="login">
                <Input
                  size="large"
                  prefix={<MailOutlined />}
                  placeholder="Email"
                  type="email"
                  className="mb-3 rounded-lg"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <Input.Password
                  size="large"
                  prefix={<LockOutlined />}
                  placeholder="Password"
                  className="mb-4 rounded-lg"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <Button
                  type="primary"
                  size="large"
                  block
                  loading={loading}
                  disabled={!email || !password}
                  className="rounded-full bg-blue-600 hover:bg-blue-700"
                  onClick={handleLogin}
                >
                  Sign In
                </Button>
              </TabPane>

              {/* SIGNUP TAB */}
              <TabPane tab="Create Account" key="signup">
                <Input
                  size="large"
                  prefix={<MailOutlined />}
                  placeholder="Email"
                  className="mb-3 rounded-lg"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <Input.Password
                  size="large"
                  prefix={<LockOutlined />}
                  placeholder="Password"
                  className="mb-4 rounded-lg"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <Button
                  type="primary"
                  size="large"
                  block
                  loading={loading}
                  disabled={!email || !password}
                  className="rounded-full bg-blue-600 hover:bg-blue-700"
                  onClick={handleSignUp}
                >
                  Create Account
                </Button>
              </TabPane>
            </Tabs>

            {/* SOCIAL LOGIN */}
            <Divider>Or continue with</Divider>

            <div className="grid grid-cols-2 gap-3">
              <Button
                icon={<GoogleOutlined />}
                loading={socialLoading === "google"}
                className="rounded-full flex items-center justify-center"
                onClick={() => loginWithProvider("google")}
              >
                Google
              </Button>

              <Button
                icon={<GithubOutlined />}
                loading={socialLoading === "github"}
                className="rounded-full flex items-center justify-center"
                onClick={() => loginWithProvider("github")}
              >
                GitHub
              </Button>

              <Button
                icon={<FacebookOutlined />}
                loading={socialLoading === "facebook"}
                className="rounded-full flex items-center justify-center"
                onClick={() => loginWithProvider("facebook")}
              >
                Facebook
              </Button>

              <Button
                icon={<SiSpotify size={18} />}
                loading={socialLoading === "spotify"}
                className="rounded-full flex items-center justify-center"
                onClick={() => loginWithProvider("spotify")}
              >
                Spotify
              </Button>
            </div>

            {/* TERMS */}
            <p className="text-center text-xs mt-5 text-gray-600 dark:text-gray-400">
              By signing in, you agree to SwiftMeta’s{" "}
              <a href="/terms" className="text-blue-600 dark:text-blue-400">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="/privacy" className="text-blue-600 dark:text-blue-400">
                Privacy Policy
              </a>
              .
            </p>
          </>
        ) : (
          <>
  <div className="flex flex-col items-center justify-center space-y-6 py-8">
    <p className="text-lg text-center text-gray-800 dark:text-gray-200">
      Welcome, <span className="font-semibold">{user.email}</span>
    </p>

    <div className="w-full max-w-sm flex flex-col gap-3">
      <Button
        danger
        block
        size="large"
        loading={loading}
        className="rounded-full h-12 text-base font-medium shadow-sm transition hover:scale-[1.01] active:scale-[0.97]"
        onClick={handleLogOut}
      >
        Logout
      </Button>

      <Button
        block
        size="large"
        loading={loading}
        className="rounded-full h-12 text-base font-medium bg-black text-white dark:bg-white dark:text-black shadow-sm border-none transition hover:opacity-90 active:scale-[0.97]"
      >
        <Link to="/dashboard" className="w-full flex justify-center items-center">
          Go to Dashboard
        </Link>
      </Button>
    </div>
  </div>
</>

        )}
      </Card>
    </div>
  );
}
