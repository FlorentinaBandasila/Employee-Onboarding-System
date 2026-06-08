interface Ticket {
  id: number;
  employee_name: string;
  role: string;
  start_date: string;
  hardware_tier: string;
  status: string;
  manager_status: string | null;
  finance_status: string | null;
  it_status: string | null;
  notes: string;
  job_description: string;
}

interface CreateTicketPayload {
  employee_name: string;
  role: string;
  start_date: string;
  hardware_tier: string;
  notes?: string;
}