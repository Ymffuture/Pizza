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
      return;
    }

    let isMounted = true;

    const verifyEmail = async () => {
      try {
        await api.get(`/quiz/verify-email`, {
          params: { token },
        });

        if (!isMounted) return;

        setStatus("success");
        toast.success("Email verified successfully");

        setTimeout(() => navigate("/"), 2500);
      } catch (err) {
        if (!isMounted) return;

        setStatus("error");
        toast.error(
          err?.response?.data?.message || "Verification link is invalid or expired"
        );
      }
    };

    verifyEmail();

    return () => {
      isMounted = false;
    };
  }, [token, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-6">
      <div className="w-full max-w-md rounded-2xl bg-white dark:bg-gray-800 p-8 shadow-lg text-center space-y-5">
        {status === "loading" && (
          <>
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-gray-900" />
            <p className="text-gray-600 dark:text-gray-300">
              Verifying your email…
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <FiCheckCircle className="mx-auto text-4xl text-green-500" />
            <h2 className="text-xl font-semibold">Email Verified</h2>
            <p className="text-gray-600 dark:text-gray-300">
              You can now continue to the quiz.
            </p>
          </>
        )}

        {status === "error" && (
          <>
            <FiXCircle className="mx-auto text-4xl text-red-500" />
            <h2 className="text-xl font-semibold">Verification Failed</h2>
            <p className="text-gray-600 dark:text-gray-300">
              This verification link is invalid or has expired.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
