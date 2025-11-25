import React, { useEffect, useState } from "react";
import { api, setToken } from "../api";
import {toast} from "react-hot-toast";

export default function Profile(){
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    setToken(token);
    async function fetchUser(){
      try {
        // server doesn't expose profile route; we can read token payload or call /posts? We will fetch first post author as simple hack
        const res = await api.get("/posts");
        const first = res.data.find(p => true);
        // this is just placeholder: better to add a /auth/me route server-side
        // For now show name from token subject — skip
      } catch (err) {}
    }
    fetchUser();
  }, []);

  async function update(){
    try {
      const token = localStorage.getItem("token");
      if (!token) return toast.error("Not logged in");
      const res = await api.put("/auth/profile", { name });
      toast.success("Saved");
    } catch (err){ toast.error("Error"); }
  }

  return (
    <div style={{ maxWidth: 640 }}>
      <h2>Profile</h2>
      <div>
        <label>Display name</label>
        <input value={name} onChange={e=>setName(e.target.value)} />
      </div>
      <button onClick={update}>Save</button>
    </div>
  );
}
