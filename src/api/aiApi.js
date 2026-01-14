import axios from "./axios";

export const analyzeTicketAI = async data => {
  const res = await axios.post("/ai/analyze", data);
  return res.data;
};
