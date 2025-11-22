import { useEffect, useState } from "react";
import { supabase } from "./lib/supabaseClient";
import {
  Input,
  Button,
  Alert,
  Card,
  Spin,
  Tabs,
} from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";

const { TabPane } = Tabs;

export default function SignIn_Up() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ----------------------------
  // HANDLERS
  // ----------------------------
  const handleSignUp = async () => {
    setError("");
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({ email, password });

    setLoading(false);
    if (error) return setError(error.message);
    setUser(data.user ?? null);
  };

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
  };

  const handleLogOut = async () => {
    setError("");
    setLoading(true);

    const { error } = await supabase.auth.signOut();

    setLoading(false);
    if (error) return setError(error.message);
    setUser(null);
  };

  // ----------------------------
  // SESSION LISTENER
  // ----------------------------
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
  // FRONTEND UI (Clean Apple Style)
  // ------------------------------------
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50 dark:bg-black">
      <Card
        className="w-full max-w-md shadow-xl rounded-2xl border border-gray-200/60 dark:border-white/10 dark:bg-gray-900/80 backdrop-blur-xl"
        style={{ borderRadius: "20px" }}
      >
        <h2 className="text-3xl font-semibold text-center mb-6 text-gray-900 dark:text-white">
          SwiftMeta Authentication
        </h2>

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
          </>
        ) : (
          <>
            <p className="text-lg text-center mb-5 text-gray-800 dark:text-gray-200">
              Welcome, <span className="font-medium">{user.email}</span>
            </p>

            <Button
              danger
              block
              size="large"
              loading={loading}
              className="rounded-full"
              onClick={handleLogOut}
            >
              Logout
            </Button>
          </>
        )}
      </Card>
    </div>
  );
}
