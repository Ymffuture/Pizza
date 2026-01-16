import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { FiCheckCircle, FiXCircle } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { api } from "../api";

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [status, setStatus] = useState("loading"); // loading | success | error
  const [verified, setVerified] = useState(false);  // ✅ added

  useEffect(() => {
    if (!token) {
      setStatus("error");
      toast.error("Invalid verification link");
      return;
    }

    let isMounted = true;

    const verifyEmail = async () => {
      try {
        const res = await api.get("/quiz/verify", {
          params: { token },
          timeout: 15000,
        });

        if (!isMounted) return;

        // ✅ Persist verified email in state and localStorage
        if (res?.data?.verified) {
          localStorage.setItem("verifiedEmail", res.data.email);
          setVerified(true);
        }

        setStatus("success");
        toast.success("Email verified successfully");

        setTimeout(() => navigate("/start-quiz"), 2000);
      } catch (err) {
        if (!isMounted) return;

        setStatus("error");
        const msg =
          err?.response?.data?.message || "Verification failed or expired";
        toast.error(msg);

        setTimeout(() => navigate("/?resend=true"), 3000);
      }
    };

    verifyEmail();

    return () => {
      isMounted = false;
    };
  }, [token, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-6 dark:text-white">
      <div className="w-full max-w-md rounded-2xl p-8 shadow-lg text-center space-y-6">
        <AnimatePresence mode="wait">
          {/* LOADING */}
          {status === "loading" && (
            <motion.div
              key="loading"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <motion.div
                className="mx-auto h-12 w-12 rounded-full border-4 border-gray-300 border-t-gray-900"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
              />
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Verifying your email…
              </p>
            </motion.div>
          )}

          {/* SUCCESS */}
          {status === "success" && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 18 }}
              className="space-y-4"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.15, type: "spring", stiffness: 300 }}
              >
                <FiCheckCircle className="mx-auto text-6xl text-green-500" />
              </motion.div>

              <h2 className="text-2xl font-bold">Email Verified!</h2>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-gray-600 dark:text-gray-300"
              >
                Redirecting to the quiz…
              </motion.p>
            </motion.div>
          )}

          {/* ERROR */}
          {status === "error" && (
            <motion.div
              key="error"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 18 }}
              className="space-y-4"
            >
              <motion.div
                initial={{ rotate: -10, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 260 }}
              >
                <FiXCircle className="mx-auto text-6xl text-red-500" />
              </motion.div>

              <h2 className="text-2xl font-bold">Verification Failed</h2>

              <p className="text-gray-600 dark:text-gray-300">
                The link is invalid or expired. Redirecting…
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
