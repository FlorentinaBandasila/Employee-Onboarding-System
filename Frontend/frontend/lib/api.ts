const BASE_URL = "http://localhost:8000";

export async function getUsers() {
  const res = await fetch(`${BASE_URL}/users/get-all-users`);
  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json();
}


export async function getTickets(): Promise<Ticket[]> {
  const res = await fetch(`${BASE_URL}/onboarding/Tickets`);
  if (!res.ok) throw new Error("Failed to fetch tickets");
  return res.json();
}

export async function createTicket(payload: CreateTicketPayload): Promise<Ticket> {
  const res = await fetch(`${BASE_URL}/onboarding/Tickets`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to create ticket");
  return res.json();
}