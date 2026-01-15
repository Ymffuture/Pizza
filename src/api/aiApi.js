import { api } from "./api";

export const analyzeTicketAI = async ({ email, subject, message }) => {
  const res = await api.post("/ai/analyze", {
    email,
    subject,
    message,
    mode: "single_suggestion", // 👈 enforce behavior
  });

  return res.data;
};
