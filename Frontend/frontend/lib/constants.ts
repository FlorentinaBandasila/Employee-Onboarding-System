export const COLORS: Record<string, string> = {
  "Active onboardings": "bg-blue-100",
  "Needs your action": "bg-yellow-100",
  "Needs rework": "bg-red-100",
  "Completed": "bg-green-100",
};

export const ACTION_STATUS: Record<string, string> = {
  HR: "Needs Rework",
  Management: "Waiting Manager",
  Finance: "Waiting Finance",
  IT: "Waiting IT",
};

export const DEPT_ENDPOINT: Record<string, string> = {
  Management: "manager-status",
  Finance: "finance-status",
  IT: "it-status",
};

export const DEPT_STATUS: Record<string, string> = {
  Management: "Waiting Manager",
  Finance: "Waiting Finance",
  IT: "Waiting IT",
};

export const ROLES = [
  "Software Engineer",
  "Product Manager",
  "HR Specialist",
  "DevOps Engineer",
  "QA Engineer",
  "UX Designer",
  "Finance Analyst",
  "Sales Representative",
];

export const AVATAR_COLORS = [
  "bg-purple-200", "bg-blue-100", "bg-green-100",
  "bg-red-100", "bg-yellow-100", "bg-pink-100",
];

export const FILTERS = ["All", "Needs my action", "In progress", "Needs rework", "Completed"];