import { useEffect, useState } from "react";
import { supabase } from "./lib/supabaseClient";
import { Card, Input, Button, Divider, Alert } from "antd";
import {
  GoogleOutlined,
  GithubOutlined,
  FacebookOutlined,
  MailOutlined,
  LockOutlined,
} from "@ant-design/icons";
import { RiSpotifyFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";

export default function SignIn_Up() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // -------------------------------------------
  // EMAIL LOGIN
  // -------------------------------------------
  const loginEmail = async () => {
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

  // -------------------------------------------
  // EMAIL SIGNUP
  // -------------------------------------------
  const signupEmail = async () => {
    setError("");
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    setLoading(false);
    if (error) return setError(error.message);

    if (data.user) navigate("/dashboard");
  };

  // -------------------------------------------
  // SOCIAL LOGIN
  // -------------------------------------------
  const loginWith = async (provider) => {
    setError("");
    setLoading(true);

    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: "https://swiftmeta.vercel.app",
      },
    });

    setLoading(false);
    if (error) setError(error.message);
  };

  // -------------------------------------------
  // SESSION LISTENER
  // -------------------------------------------
  useEffect(() => {
    const loadSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      if (session?.user) navigate("/dashboard");
    };

    loadSession();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) navigate("/dashboard");
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <Card
        className="w-full max-w-md backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl"
        styles={{
          body: { padding: 30 },
        }}
      >
        <h2 className="text-center text-white text-3xl font-semibold mb-6">
          SwiftMeta Login
        </h2>

        {error && (
          <Alert
            message={error}
            type="error"
            showIcon
            className="mb-4 rounded-md"
          />
        )}

        {!user ? (
          <>
            <Input
              size="large"
              prefix={<MailOutlined className="text-gray-400" />}
              placeholder="Email"
              className="mb-3 rounded-lg bg-black/20 text-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input.Password
              size="large"
              prefix={<LockOutlined className="text-gray-400" />}
              placeholder="Password"
              className="mb-4 rounded-lg bg-black/20 text-white"
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
              onClick={loginEmail}
            >
              Login
            </Button>

            <Button
              size="large"
              block
              disabled={!email || !password}
              className="rounded-full mt-3 bg-white/10 hover:bg-white/20 text-white border-none"
              onClick={signupEmail}
            >
              Create Account
            </Button>

            <Divider className="text-gray-400">Or continue with</Divider>

            {/* SOCIAL BUTTONS */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                icon={<GoogleOutlined />}
                size="large"
                className="rounded-lg bg-white text-black"
                onClick={() => loginWith("google")}
              >
                Google
              </Button>

              <Button
                icon={<GithubOutlined />}
                size="large"
                className="rounded-lg bg-white text-black"
                onClick={() => loginWith("github")}
              >
                GitHub
              </Button>

              <Button
                icon={<FacebookOutlined style={{ color: "#1877F2" }} />}
                size="large"
                className="rounded-lg bg-white text-black"
                onClick={() => loginWith("facebook")}
              >
                Facebook
              </Button>

              <Button
                icon={<RiSpotifyFill size={18} color="#1DB954" />}
                size="large"
                className="rounded-lg bg-white text-black"
                onClick={() => loginWith("spotify")}
              >
                Spotify
              </Button>
            </div>
          </>
        ) : (
          <p className="text-center text-gray-300 animate-pulse">
            Redirecting...
          </p>
        )}
      </Card>
    </div>
  );
}
