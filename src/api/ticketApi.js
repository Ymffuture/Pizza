import axios from "axios";

const API = "https://swiftmeta.onrender.com/api/tickets";

/* -----------------------------
   Create ticket
------------------------------ */
export const createTicket = async data => {
  const res = await axios.post(API, data);
  return res.data;
};

/* -----------------------------
   Get single ticket by ID
------------------------------ */
export const getTicket = async id => {
  const res = await axios.get(`${API}/${id}`);
  return res.data;
};

/* -----------------------------
   Reply to ticket
------------------------------ */
export const replyTicket = async (id, data) => {
  const res = await axios.post(`${API}/${id}/reply`, data);
  return res.data;
};

/* -----------------------------
   NEW: Get all tickets (admin)
------------------------------ */
export const getAllTickets = async () => {
  const res = await axios.get(API);
  return res.data;
};

/* -----------------------------
   NEW: Close ticket
------------------------------ */
export const closeTicket = async id => {
  const res = await axios.patch(`${API}/${id}/close`);
  return res.data;
};
