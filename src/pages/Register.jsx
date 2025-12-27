import React, {
  useState,
  useEffect,
  useTransition,
  useDeferredValue,
  useId,
  useCallback,
} from "react";
import { api } from "../api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Register() {
  // -------------------------
  // State
  // -------------------------
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarURL, setAvatarURL] = useState("");

  // React 18 concurrency
  const [isPending, startTransition] = useTransition();

  // Defer avatar rendering (smoother UI)
  const deferredAvatarURL = useDeferredValue(avatarURL);

  const nav = useNavigate();

  // Accessibility-safe IDs
  const phoneId = useId();
  const emailId = useId();
  const nameId = useId();

  // -------------------------
  // Effects
  // -------------------------
  useEffect(() => {
    if (!avatarFile) return;

    const url = URL.createObjectURL(avatarFile);
    setAvatarURL(url);

    return () => URL.revokeObjectURL(url);
  }, [avatarFile]);

  // -------------------------
  // Utils
  // -------------------------
  const isPhoneValid = useCallback((number) => {
    return /^[0-9]{9,15}$/.test(number);
  }, []);

  // -------------------------
  // Submit (non-blocking)
  // -------------------------
  const onSubmit = useCallback(
    (e) => {
      e.preventDefault();

      if (!isPhoneValid(phone)) {
        toast.error("Enter a valid phone number");
        return;
      }

      startTransition(async () => {
        try {
          const formData = new FormData();
          formData.append("phone", phone);
          formData.append("email", email.trim());
          formData.append("name", name.trim());
          if (avatarFile) formData.append("avatar", avatarFile);

          const res = await api.post("/auth/register", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });

          // Show OTP if backend sends it
          if (res.data?.otp_code) {
            toast.success(`OTP: ${res.data.otp_code}`);
          }

          if (res.data?.message) {
            nav("/dashboard/blog/verify-email", {
              state: { email },
            });
          } else {
            toast.error("Server didn’t send confirmation");
          }
        } catch (err) {
          const msg =
            err.response?.data?.message ||
            "Registration request failed";
          toast.error(msg);
          console.error("REGISTER ERROR:", err);
        }
      });
    },
    [phone, email, name, avatarFile, nav, isPhoneValid]
  );

  // -------------------------
  // UI
  // -------------------------
  return (
    <div className="flex flex-col justify-center items-center bg-gray-100 dark:bg-black p-5">
      <div className="bg-white dark:bg-gray-900 w-full max-w-sm p-6 rounded-3xl shadow-xl">
        <h2 className="text-2xl font-semibold text-center mb-4 text-black dark:text-white">
          Create Account
        </h2>

        {/* Avatar */}
        <div className="flex justify-center mb-5">
          <label className="relative cursor-pointer">
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setAvatarFile(e.target.files?.[0] || null)
              }
              className="hidden"
            />

            <img
              src={
                deferredAvatarURL ||
                "https://via.placeholder.com/80?text=Avatar"
              }
              alt="Profile preview"
              className="w-20 h-20 rounded-full object-cover border-2 dark:border-gray-700"
            />

            <span className="absolute bottom-0 right-0 bg-black text-white text-[10px] px-2 py-1 rounded-full">
              Edit
            </span>
          </label>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="space-y-3">
          <label htmlFor={phoneId} className="sr-only">
            Phone number
          </label>
          <input
            id={phoneId}
            placeholder="Cellphone number"
            value={phone}
            onChange={(e) =>
              setPhone(e.target.value.replace(/\s/g, ""))
            }
            required
            className="w-full px-4 py-3 rounded-full border border-gray-300 dark:border-gray-700 dark:bg-black text-sm text-black dark:text-white outline-none text-center"
          />

          <label htmlFor={emailId} className="sr-only">
            Email address
          </label>
          <input
            id={emailId}
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-full border border-gray-300 dark:border-gray-700 dark:bg-black text-sm text-black dark:text-white outline-none text-center"
          />

          <label htmlFor={nameId} className="sr-only">
            Display name
          </label>
          <input
            id={nameId}
            placeholder="Display name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-full border border-gray-300 dark:border-gray-700 dark:bg-black text-sm text-black dark:text-white outline-none text-center"
          />

          <button
            type="submit"
            disabled={isPending}
            className="w-full py-3 rounded-full font-medium bg-black text-white hover:opacity-90 active:scale-95 transition text-sm disabled:opacity-60"
          >
            {isPending ? "Processing..." : "Register"}
          </button>
        </form>

        <p className="text-center text-[11px] mt-4 text-gray-500 dark:text-gray-400">
          A verification code will be sent to your email
        </p>
      </div>
    </div>
  );
}
