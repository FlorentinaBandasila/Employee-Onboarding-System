"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface User {
  id: number;
  full_name: string;
  department: string;
  email: string;
  role: string;
}

interface UserContextValue {
  currentUser: User | null;
  setCurrentUser: (u: User) => void;
  users: User[];
}

const UserContext = createContext<UserContextValue>({
  currentUser: null,
  setCurrentUser: () => {},
  users: [],
});

export function UserProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    fetch("http://localhost:8000/users/get-all-users")
      .then((r) => r.json())
      .then((data) => {
        setUsers(data);
        setCurrentUser(data[0]);
      })
      .catch(() => {});
  }, []);

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser, users }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);