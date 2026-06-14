const API_BASE = import.meta.env.VITE_API_URL || '/api';

async function handleResponse(res) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || `Request failed with status ${res.status}`);
  }
  return data;
}

export async function createTicket(payload) {
  const res = await fetch(`${API_BASE}/tickets`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

export async function getTickets({ status, search } = {}) {
  const params = new URLSearchParams();
  if (status) params.set('status', status);
  if (search) params.set('search', search);

  const res = await fetch(`${API_BASE}/tickets?${params.toString()}`);
  return handleResponse(res);
}

export async function getTicket(ticketId) {
  const res = await fetch(`${API_BASE}/tickets/${ticketId}`);
  return handleResponse(res);
}

export async function updateTicket(ticketId, payload) {
  const res = await fetch(`${API_BASE}/tickets/${ticketId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}
