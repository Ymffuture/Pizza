import { useState, useContext } from "react";
import api from "../api";
import { AuthContext } from "../context/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Verify() {
  const [code, setCode] = useState("");
  const { loginWithToken } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const phone = location.state?.phone;

  const handleVerify = async () => {
    try {
      const res = await api.post("/auth/verify-otp", { phone, code });
      loginWithToken(res.data.token);
      navigate("/blog");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Invalid code");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h2>Verify OTP</h2>
      <p>Code sent to your email/phone</p>
      <input value={code} onChange={(e)=>setCode(e.target.value)} className="w-full mb-3"/>
      <button onClick={handleVerify} className="btn-primary">Verify</button>
    </div>
  );
}
