// services/ticketService.js
import axios from "axios";

const API = "https://swiftmeta.onrender.com/api/tickets";

/* ---------------------------------------
   Axios instance (clean & reusable)
---------------------------------------- */
const ticketApi = axios.create({
  baseURL: API,
  headers: {
    "Content-Type": "application/json",
  },
});

/* ---------------------------------------
   Helpers (normalization layer)
---------------------------------------- */
const extractTicket = (res) =>
  res?.ticket || res?.data?.ticket || res;

const extractTickets = (res) =>
  res?.tickets || res?.data?.tickets || res || [];

/* ---------------------------------------
   Create Ticket
---------------------------------------- */
export const createTicket = async (payload) => {
  try {
    const { data } = await ticketApi.post("/", payload);
    return extractTicket(data);
  } catch (error) {
    throw error.response?.data || { error: "Failed to create ticket" };
  }
};

/* ---------------------------------------
   Get Single Ticket
---------------------------------------- */
export const getTicket = async (ticketId) => {
  try {
    const { data } = await ticketApi.get(`/${ticketId}`);
    return extractTicket(data);
  } catch (error) {
    throw error.response?.data || { error: "Failed to fetch ticket" };
  }
};

/* ---------------------------------------
   Reply to Ticket
---------------------------------------- */
export const replyTicket = async (ticketId, payload) => {
  try {
    const { data } = await ticketApi.post(`/${ticketId}/reply`, payload);
    return extractTicket(data);
  } catch (error) {
    throw error.response?.data || { error: "Failed to send reply" };
  }
};

/* ---------------------------------------
   Get All Tickets (Admin)
---------------------------------------- */
export const getAllTickets = async (params = {}) => {
  try {
    const { data } = await ticketApi.get("/", { params });
    return extractTickets(data);
  } catch (error) {
    throw error.response?.data || { error: "Failed to fetch tickets" };
  }
};

/* ---------------------------------------
   Close Ticket
---------------------------------------- */
export const closeTicket = async (ticketId) => {
  try {
    const { data } = await ticketApi.patch(`/${ticketId}/close`);
    return extractTicket(data);
  } catch (error) {
    throw error.response?.data || { error: "Failed to close ticket" };
  }
};

/* ---------------------------------------
   Global API Error Interceptor
---------------------------------------- */
ticketApi.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Ticket API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

/* ---------------------------------------
   Named + default exports
---------------------------------------- */
export default {
  createTicket,
  getTicket,
  replyTicket,
  getAllTickets,
  closeTicket,
};
