import type { Metadata } from "next";
import '@/styles/globals.scss'
import { Aside } from "@/components/Aside";
import { Header } from "@/components/Header";

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
        <div className="app">
          <Aside />
          <Header />
          <div className="content">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
