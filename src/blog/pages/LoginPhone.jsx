import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function LoginPhone() {
  const [phone, setPhone] = useState("");
  const navigate = useNavigate();

  const requestOtp = async () => {
    try {
      await api.post("/auth/request-otp", { phone });
      toast.success("OTP sent (email or SMS depending on server config)");
      navigate("/blog/verify", { state: { phone } });
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h2>Login with phone</h2>
      <input value={phone} onChange={(e)=>setPhone(e.target.value)} className="w-full mb-3" />
      <button onClick={requestOtp} className="btn-primary">Request OTP</button>
    </div>
  );
}
