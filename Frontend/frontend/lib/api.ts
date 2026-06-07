export async function getUsers() {
  const res = await fetch("http://localhost:8000/users/get-all-users");
  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json();
}