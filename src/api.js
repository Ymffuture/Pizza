import axios from "axios";

export const api = axios.create({
  baseURL: "https://swiftmeta.onrender.com/api",
});

export function setToken(token) {
  if (token) api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  else delete api.defaults.headers.common["Authorization"];
}
