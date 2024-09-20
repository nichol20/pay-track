"use client"
import '@/styles/globals.scss'
import { Aside } from "@/components/Aside";
import { Header } from "@/components/Header";
import { useAuth } from '@/contexts/Auth';
import { useEffect } from 'react';
import { redirect } from 'next/navigation';

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user } = useAuth()

  useEffect(() => {
    if (!user) {
      redirect("/login")
    }
  }, [user])

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
