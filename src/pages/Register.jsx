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
import { Camera, User, Mail, Smartphone, ArrowRight, Loader2 } from "lucide-react";

export default function Register() {
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarURL, setAvatarURL] = useState("");
  const [error, setError] = useState(null);
  const [devOtp, setDevOtp] = useState(null);

  const [isPending, startTransition] = useTransition();
  const deferredAvatarURL = useDeferredValue(avatarURL);
  const nav = useNavigate();

  const phoneId = useId();
  const emailId = useId();
  const nameId = useId();

  useEffect(() => {
    if (!avatarFile) return;
    const url = URL.createObjectURL(avatarFile);
    setAvatarURL(url);
    return () => URL.revokeObjectURL(url);
  }, [avatarFile]);

  const isPhoneValid = useCallback((number) => {
    return /^[0-9]{9,15}$/.test(number);
  }, []);

  const onSubmit = useCallback(
    (e) => {
      e.preventDefault();
      setError(null);
      setDevOtp(null);

      if (!isPhoneValid(phone)) {
        setError("Please enter a valid phone number");
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

          if (res.data?.otp_code) {
            setDevOtp(res.data.otp_code);
          }

          if (res.data?.message) {
            nav("/dashboard/blog/verify-email", { state: { email } });
          }
        } catch (err) {
          setError(err.response?.data?.message || "Registration failed");
          console.error("REGISTER ERROR:", err);
        }
      });
    },
    [phone, email, name, avatarFile, nav, isPhoneValid]
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fafafa] dark:bg-[#0a0a0a] p-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white dark:bg-[#111] rounded-3xl shadow-[0_8px_40px_-12px_rgba(0,0,0,0.1)] dark:shadow-[0_8px_40px_-12px_rgba(0,0,0,0.5)] border border-gray-100 dark:border-white/5 overflow-hidden">
          
          {/* Header */}
          <div className="px-8 pt-10 pb-6 text-center">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white tracking-tight">
              Create Account
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Join us to get started
            </p>
          </div>

          {/* Dev OTP Banner */}
          {devOtp && (
            <div className="mx-8 mb-6 p-4 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg relative overflow-hidden">
              <div className="absolute inset-0 bg-white/10" />
              <div className="relative flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-medium text-white/70 uppercase tracking-wider">Development OTP</p>
                  <p className="text-2xl font-mono font-bold tracking-widest mt-1">{devOtp}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur">
                  <Mail size={18} className="text-white" />
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mx-8 mb-6 p-4 rounded-2xl bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          {/* Avatar Upload */}
          <div className="flex justify-center mb-8 px-8">
            <label className="relative group cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
                className="hidden"
              />
              
              <div className="relative w-24 h-24 rounded-full overflow-hidden ring-4 ring-gray-50 dark:ring-gray-800 transition-all duration-300 group-hover:ring-gray-200 dark:group-hover:ring-gray-700">
                {deferredAvatarURL ? (
                  <img
                    src={deferredAvatarURL}
                    alt="Profile preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center">
                    <User size={32} className="text-gray-400 dark:text-gray-600" />
                  </div>
                )}
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                  <Camera size={20} className="text-white" />
                </div>
              </div>

              {/* Edit Badge */}
              <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-black dark:bg-white rounded-full flex items-center justify-center shadow-lg">
                <Camera size={14} className="text-white dark:text-black" />
              </div>
            </label>
          </div>

          {/* Form */}
          <form onSubmit={onSubmit} className="px-8 pb-10 space-y-4">
            {/* Phone Input */}
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-gray-900 dark:group-focus-within:text-white transition-colors">
                <Smartphone size={18} />
              </div>
              <input
                id={phoneId}
                type="tel"
                placeholder="Phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\s/g, ""))}
                required
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-gray-50 dark:bg-[#0a0a0a] border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent transition-all text-sm"
              />
            </div>

            {/* Email Input */}
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-gray-900 dark:group-focus-within:text-white transition-colors">
                <Mail size={18} />
              </div>
              <input
                id={emailId}
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-gray-50 dark:bg-[#0a0a0a] border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent transition-all text-sm"
              />
            </div>

            {/* Name Input */}
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-gray-900 dark:group-focus-within:text-white transition-colors">
                <User size={18} />
              </div>
              <input
                id={nameId}
                type="text"
                placeholder="Full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-gray-50 dark:bg-[#0a0a0a] border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent transition-all text-sm"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isPending}
              className="w-full mt-6 py-4 rounded-2xl font-semibold bg-black dark:bg-white text-white dark:text-black hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
            >
              {isPending ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Creating account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer Note */}
        <p className="text-center text-xs text-gray-400 dark:text-gray-600 mt-6">
          By registering, you agree to our Terms and Privacy Policy
        </p>
      </div>
    </div>
  );
}
