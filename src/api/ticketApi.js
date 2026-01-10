import axios from "axios";

const API = "https://swiftmeta.onrender.com/api/tickets";

export const getAllTickets = async () => {
  const res = await axios.get(API);
  return res.data;
};

export const getTicket = async id => {
  const res = await axios.get(`${API}/${id}`);
  return res.data;
};

export const replyTicket = async (id, data) => {
  const res = await axios.post(`${API}/${id}/reply`, data);
  return res.data;
};

export const closeTicket = async id => {
  const res = await axios.patch(`${API}/${id}/close`);
  return res.data;
};
