import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtp, setShowOtp] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    await axios.post('/api/auth/login', { phone });
    setShowOtp(true);
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const res = await axios.post('/api/auth/verify-otp', { phone, otp });
    localStorage.setItem('token', res.data.token);
    alert('Logged in');
  };

  return (
    !showOtp ? (
      <form onSubmit={handleLogin}>
        <input type="text" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
        <button type="submit">Send OTP</button>
      </form>
    ) : (
      <form onSubmit={handleVerify}>
        <input type="text" placeholder="OTP" value={otp} onChange={(e) => setOtp(e.target.value)} />
        <button type="submit">Verify</button>
      </form>
    )
  );
};

export default Login;
