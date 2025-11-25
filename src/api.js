import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:6525/api",
});

export function setToken(token) {
  if (token) api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  else delete api.defaults.headers.common["Authorization"];
}
