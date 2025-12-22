import {api} from "../api";

/**
 * Request email verification
 */
export const requestVerification = (email) => {
  return api.post("/quiz/verify-email", { email });
};

/**
 * Submit quiz answers
 */
export const submitQuiz = (payload) => {
  return api.post("/quiz/submit", payload);
};
