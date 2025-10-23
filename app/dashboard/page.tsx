"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { DashboardHeader } from "@/dashboard-header";
import { DashboardSidebar } from "@/dashboard-sidebar";

export default function DashboardPage() {
  const { status } = useSession();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") router.replace("/");
  }, [status, router]);

  if (status === "loading") return null;

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <DashboardHeader onSidebarToggle={() => setCollapsed((v) => !v)} />
      <div className="flex flex-1 overflow-hidden">
        <DashboardSidebar jobs={[]} collapsed={collapsed} onJobSelect={() => {}} onNewJob={() => {}} onEstimate={() => {}} />
        <main className="flex-1 overflow-auto p-6">Welcome to Dashboard</main>
      </div>
    </div>
  );
}
