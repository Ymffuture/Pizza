const API = "https://swiftmeta.onrender.com/api/tickets";

export const createTicket = (data) =>
  fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then(res => res.json());

export const getTicket = (id) =>
  fetch(`${API}/${id}`).then(res => res.json());

export const replyTicket = (id, data) =>
  fetch(`${API}/${id}/reply`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then(res => res.json());
