import type { Metadata } from "next";
import '@/styles/globals.scss'
import { AuthProvider } from "@/contexts/AuthContext";

export const metadata: Metadata = {
  title: "Track pay",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
