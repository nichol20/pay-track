import type { Metadata } from "next";
import '@/styles/globals.scss'
import { AuthProvider } from "@/contexts/Auth";
import { ToastProvider } from "@/contexts/Toast";

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
        <ToastProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
