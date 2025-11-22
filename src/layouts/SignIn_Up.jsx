import { useEffect, useState } from "react";
import { supabase } from "./lib/supabaseClient";
import { Input, Button, Alert, Card, Tabs } from "antd";
import { MailOutlined, LockOutlined, UserOutlined, PhoneOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { TabPane } = Tabs;

export default function SignIn_Up() {
  const navigate = useNavigate();

  // FORM STATES
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");

  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ------------------------------------------------
  // SIGN UP WITH PROFILE INSERT
  // ------------------------------------------------
  const handleSignUp = async () => {
    setError("");
    setLoading(true);

    // 1️⃣ Create account
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setLoading(false);
      return setError(error.message);
    }

    const userId = data.user?.id;
    if (!userId) {
      setLoading(false);
      return setError("Failed to create user.");
    }

    // 2️⃣ Insert into profile table
    const { error: profileError } = await supabase.from("profiles").insert([
      {
        id: userId,
        username,
        phone,
        email,
      },
    ]);

    setLoading(false);

    if (profileError) return setError(profileError.message);

    setUser(data.user);
    navigate("/dashboard"); // Redirect
  };

  // ------------------------------------------------
  // LOGIN
  // ------------------------------------------------
  const handleLogin = async () => {
    setError("");
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) return setError(error.message);

    setUser(data.user);
    navigate("/dashboard"); // Redirect after login
  };

  const handleLogOut = async () => {
    setError("");
    setLoading(true);

    const { error } = await supabase.auth.signOut();

    setLoading(false);
    if (error) return setError(error.message);

    setUser(null);
  };

  // ------------------------------------------------
  // SESSION LISTENER
  // ------------------------------------------------
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

  // ------------------------------------------------
  // UI
  // ------------------------------------------------
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50 dark:bg-black">
      <Card className="w-full max-w-md shadow-xl rounded-2xl dark:bg-gray-900/80">
        <h2 className="text-3xl font-semibold text-center mb-6 text-gray-900 dark:text-white">
          SwiftMeta Authentication
        </h2>

        {error && (
          <Alert message={error} type="error" showIcon className="mb-4 rounded-lg" />
        )}

        {!user ? (
          <Tabs defaultActiveKey="login" centered tabBarStyle={{ marginBottom: 30 }}>
            {/* -------------------- LOGIN TAB -------------------- */}
            <TabPane tab="Login" key="login">
              <Input
                size="large"
                prefix={<MailOutlined />}
                placeholder="Email"
                type="email"
                className="mb-3"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input.Password
                size="large"
                prefix={<LockOutlined />}
                placeholder="Password"
                className="mb-4"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <Button
                type="primary"
                block
                size="large"
                loading={loading}
                disabled={!email || !password}
                onClick={handleLogin}
              >
                Sign In
              </Button>
            </TabPane>

            {/* -------------------- SIGNUP TAB -------------------- */}
            <TabPane tab="Create Account" key="signup">
              <Input
                size="large"
                prefix={<UserOutlined />}
                placeholder="Username"
                className="mb-3"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />

              <Input
                size="large"
                prefix={<PhoneOutlined />}
                placeholder="Phone Number"
                className="mb-3"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />

              <Input
                size="large"
                prefix={<MailOutlined />}
                placeholder="Email"
                className="mb-3"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <Input.Password
                size="large"
                prefix={<LockOutlined />}
                placeholder="Password"
                className="mb-4"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <Button
                type="primary"
                block
                size="large"
                loading={loading}
                disabled={!email || !password || !username || !phone}
                onClick={handleSignUp}
              >
                Create Account
              </Button>
            </TabPane>
          </Tabs>
        ) : (
          <>
            <p className="text-lg text-center mb-5 text-gray-700 dark:text-gray-200">
              Welcome, <span className="font-medium">{user.email}</span>
            </p>

            <Button danger block size="large" loading={loading} onClick={handleLogOut}>
              Logout
            </Button>
          </>
        )}
      </Card>
    </div>
  );
}
