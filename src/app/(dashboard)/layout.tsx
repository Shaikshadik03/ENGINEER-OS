import React from "react";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import AICopilot from "@/components/AICopilot";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const isGuestMode = cookieStore.get("guest_demo_mode")?.value === "true";

  // If NOT in guest demo mode, check Supabase user authentication
  if (!isGuestMode) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      redirect("/login");
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("onboarding_complete")
      .eq("id", user.id)
      .single();

    if (profile && profile.onboarding_complete === false) {
      redirect("/onboarding");
    }
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-sky-50/30 to-blue-50/40 text-slate-900 font-sans relative selection:bg-sky-500 selection:text-white">
      {/* Ambient Glass Glow Orbs */}
      <div className="fixed -top-40 -left-40 w-96 h-96 bg-sky-400/15 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="fixed top-1/3 right-0 w-[30rem] h-[30rem] bg-indigo-400/10 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="fixed -bottom-40 left-1/3 w-96 h-96 bg-blue-400/15 rounded-full blur-3xl pointer-events-none z-0" />

      <Sidebar />
      <div className="flex-1 md:ml-64 flex flex-col h-screen relative z-10">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          {children}
        </main>
        <AICopilot />
      </div>
    </div>
  );
}
