import { useEffect, useState } from "react";
import { supabase } from "./lib/supabaseClient";
import { Input, Button, Alert, Card, Tabs, Divider } from "antd";
import {
  MailOutlined,
  LockOutlined,
  UserOutlined,
  GithubOutlined,
  FacebookOutlined,
  GoogleOutlined,
} from "@ant-design/icons";
import { RiSpotifyFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";

const { TabPane } = Tabs;

export default function SignIn_Up() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ---------------------------------------------------
  // NORMAL SIGNUP
  // ---------------------------------------------------
  const handleSignUp = async () => {
    setError("");
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username }, // store username in user_metadata
      },
    });

    setLoading(false);
    if (error) return setError(error.message);

    if (data.user) navigate("/dashboard");
  };

  // ---------------------------------------------------
  // NORMAL LOGIN
  // ---------------------------------------------------
  const handleLogin = async () => {
    setError("");
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);
    if (error) return setError(error.message);

    if (data.user) navigate("/dashboard");
  };

  // ---------------------------------------------------
  // SOCIAL AUTH HANDLERS
  // ---------------------------------------------------
  const loginWithProvider = async (provider) => {
    setError("");
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });

    setLoading(false);
    if (error) return setError(error.message);
  };

  // ---------------------------------------------------
  // SESSION LISTENER
  // ---------------------------------------------------
  useEffect(() => {
    const init = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      setUser(session?.user ?? null);
      if (session?.user) navigate("/dashboard");
    };

    init();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) navigate("/dashboard");
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  // ---------------------------------------------------
  // UI
  // ---------------------------------------------------
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50 dark:bg-black">
      <Card className="w-full max-w-md shadow-xl rounded-2xl border border-gray-200/60 dark:border-white/10 dark:bg-gray-900/80 backdrop-blur-xl">
        <h2 className="text-3xl font-semibold text-center mb-6 text-gray-900 dark:text-white">
          SwiftMeta Authentication
        </h2>

        {error && (
          <Alert message={error} type="error" showIcon className="mb-4 rounded-lg" />
        )}

        {!user ? (
          <>
            <Tabs defaultActiveKey="login" centered tabBarStyle={{ marginBottom: 30 }}>
              
              {/* LOGIN */}
              <TabPane tab="Login" key="login">
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
                  onClick={handleLogin}
                >
                  Sign In
                </Button>
              </TabPane>

              {/* SIGN UP */}
              <TabPane tab="Create Account" key="signup">
                <Input
                  size="large"
                  prefix={<UserOutlined />}
                  placeholder="Username"
                  className="mb-3 rounded-lg"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />

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
                  disabled={!email || !password || !username}
                  className="rounded-full bg-blue-600 hover:bg-blue-700"
                  onClick={handleSignUp}
                >
                  Create Account
                </Button>
              </TabPane>
            </Tabs>

            <Divider>Or continue with</Divider>

            {/* SOCIAL AUTH BUTTONS */}
            <div className="grid grid-cols-2 gap-3 mt-4">

              {/* GitHub */}
              <Button
                icon={<GithubOutlined />}
                size="large"
                className="w-full rounded-lg"
                onClick={() => loginWithProvider("github")}
              >
                GitHub
              </Button>

              {/* Facebook */}
              <Button
                icon={<FacebookOutlined />}
                size="large"
                className="w-full rounded-lg"
                onClick={() => loginWithProvider("facebook")}
              >
                Facebook
              </Button>

              {/* Spotify */}
              <Button
                icon={<RiSpotifyFill size={18} color="#1DB954" />}
                size="large"
                className="w-full rounded-lg"
                onClick={() => loginWithProvider("spotify")}
              >
                Spotify
              </Button>

              {/* Google (Commented Out) */}
              {/*
              <Button
                icon={<GoogleOutlined />}
                size="large"
                className="w-full rounded-lg"
                onClick={() => loginWithProvider("google")}
              >
                Google
              </Button>
              */}
            </div>
          </>
        ) : null}
      </Card>
    </div>
  );
}
