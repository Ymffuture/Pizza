import React, { createContext, useEffect, useState } from "react";
import api, { setAuthToken } from "../api";
import jwtDecode from "jwt-decode";
import toast from "react-hot-toast";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const t = localStorage.getItem("bm_token");
    if (!t) return null;
    try {
      const p = jwtDecode(t);
      return { token: t, profile: p };
    } catch { return null; }
  });

  useEffect(() => {
    if (user?.token) setAuthToken(user.token);
    else setAuthToken(null);
  }, [user]);

  const loginWithToken = (token) => {
    const profile = jwtDecode(token);
    localStorage.setItem("bm_token", token);
    setUser({ token, profile });
    toast.success("Signed in");
  };

  const logout = () => {
    localStorage.removeItem("bm_token");
    setUser(null);
    setAuthToken(null);
  };

  return <AuthContext.Provider value={{ user, setUser, loginWithToken, logout }}>{children}</AuthContext.Provider>;
};
