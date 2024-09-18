import '@/styles/globals.scss'
import { Aside } from "@/components/Aside";
import { Header } from "@/components/Header";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="app">
      <Aside />
      <Header />
      <div className="content">
        {children}
      </div>
    </div>
  );
}
