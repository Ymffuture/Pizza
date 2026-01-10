// === Option 1 - Most popular & clean (recommended) ===

const API = "https://swiftmeta.onrender.com/api/tickets";

export const getAllTickets = async () => {
  const { data } = await axios.get(API);
  return data;
};

export const getTicket = async (id) => {
  const { data } = await axios.get(`${API}/${id}`);
  return data;
};

// Modern style - POST to the ticket itself (most common today)
export const replyToTicket = async (id, payload) => {
  const { data } = await axios.post(`${API}/${id}`, payload);
  return data;
};

// Most common today: PATCH on the ticket resource
export const closeTicket = async (id) => {
  const { data } = await axios.patch(`${API}/${id}`, { status: "closed" });
  // or even better:
  // return axios.patch(`${API}/${id}/close`);
  return data;
};
