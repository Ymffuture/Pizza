import { api } from "../api";

/**
 * Request email verification
 */
export const requestVerification = async (email) => {
  const { data } = await api.post("/quiz/verify-email", { email });
  return data;
};

/**
 * Submit quiz answers
 */
export const submitQuiz = async (payload) => {
  const { data } = await api.post("/quiz/submit", payload);
  return data;
};
