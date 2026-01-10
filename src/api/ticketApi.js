// services/ticketService.js
import axios from "axios";

const API = "https://swiftmeta.onrender.com/api/tickets";

// Optional: Create axios instance with defaults (recommended)
const ticketApi = axios.create({
  baseURL: API,
  headers: {
    "Content-Type": "application/json",
  },
  // timeout: 10000,           // optional
  // withCredentials: true,    // if you later add auth cookies
});

/**
 * Create a new support ticket
 * @param {Object} data - { email: string, subject?: string, message: string }
 */
export const createTicket = async (data) => {
  try {
    const response = await ticketApi.post("/", data);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Failed to create ticket" };
  }
};

/**
 * Get a single ticket by its ticketId
 * @param {string} id - Ticket ID
 */
export const getTicket = async (id) => {
  try {
    const response = await ticketApi.get(`/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Failed to fetch ticket" };
  }
};

/**
 * Reply to an existing ticket (user or admin)
 * @param {string} id - Ticket ID
 * @param {Object} data - { message: string, sender: "user" | "admin" }
 */
export const replyTicket = async (id, data) => {
  try {
    const response = await ticketApi.post(`/${id}/reply`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Failed to send reply" };
  }
};

/**
 * Get all tickets (usually for admin dashboard)
 * @param {Object} [params] - Optional query params e.g. { status: "open", page: 1, limit: 20 }
 */
export const getAllTickets = async (params = {}) => {
  try {
    const response = await ticketApi.get("/", { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Failed to fetch tickets" };
  }
};

/**
 * Close a ticket (usually admin only)
 * @param {string} id - Ticket ID
 */
export const closeTicket = async (id) => {
  try {
    const response = await ticketApi.patch(`/${id}/close`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Failed to close ticket" };
  }
};

// Optional: Add error interceptor (very useful in real apps)
ticketApi.interceptors.response.use(
  (response) => response,
  (error) => {
    // You can show toast/notification here in the future
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default {
  createTicket,
  getTicket,
  replyTicket,
  getAllTickets,
  closeTicket,
};
