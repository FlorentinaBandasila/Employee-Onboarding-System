import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";
import { UserProvider } from "@/lib/user-context";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex">
        <UserProvider>
          <Sidebar />
          <main className="flex-1 px-8 pb-8">{children}</main>
        </UserProvider>
      </body>
    </html>
  );
}