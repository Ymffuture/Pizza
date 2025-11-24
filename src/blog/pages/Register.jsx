import { useState, useContext } from "react";
import api from "../api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Register() {
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      await api.post("/auth/register", { phone, email });
      toast.success("OTP sent to email");
      navigate("/blog/verify", { state: { phone } });
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-2xl mb-4">Register</h2>
      <input value={phone} onChange={(e)=>setPhone(e.target.value)} placeholder="Phone (+27...)" className="w-full mb-3" />
      <input value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Email" className="w-full mb-3" />
      <button onClick={handleRegister} className="btn-primary">Send OTP</button>
    </div>
  );
}
