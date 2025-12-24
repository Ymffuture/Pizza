import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { FiCheckCircle, FiXCircle } from "react-icons/fi";
import toast from "react-hot-toast";
import { api } from "../api";

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [status, setStatus] = useState("loading");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      toast.error("Invalid verification link");
      return;
    }

    let isMounted = true;

    const verifyEmail = async () => {
      try {
        // Increased timeout to 15 seconds
        await api.get(`/quiz/verify-email`, {
          params: { token },
          timeout: 15000,
        });

        if (!isMounted) return;

        setStatus("success");
        toast.success("Email verified successfully");

        setTimeout(() => navigate("/quiz"), 2000); // Redirect to quiz directly
      } catch (err) {
        if (!isMounted) return;

        setStatus("error");
        const msg = err?.response?.data?.message || "Verification failed";
        toast.error(msg);

        // Add button to request new link on error
        setTimeout(() => navigate("/?resend=true"), 3000);
      }
    };

    verifyEmail();

    return () => { isMounted = false; };
  }, [token, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-6">
      <div className="w-full max-w-md rounded-2xl bg-white dark:bg-gray-800 p-8 shadow-lg text-center space-y-5">
        {status === "loading" && (
          <>
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-gray-900" />
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Verifying your email…
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <FiCheckCircle className="mx-auto text-6xl text-green-500" />
            <h2 className="text-2xl font-bold">Email Verified!</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Redirecting to the quiz...
            </p>
          </>
        )}

        {status === "error" && (
          <>
            <FiXCircle className="mx-auto text-6xl text-red-500" />
            <h2 className="text-2xl font-bold">Verification Failed</h2>
            <p className="text-gray-600 dark:text-gray-300">
              The link is invalid or expired. Redirecting to request a new one...
            </p>
          </>
        )}
      </div>
    </div>
  );
}
