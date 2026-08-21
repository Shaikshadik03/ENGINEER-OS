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
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const cookieStore = await cookies();
  const isGuestMode = cookieStore.get("guest_demo_mode")?.value === "true";

  // If neither logged-in Supabase user nor Guest Cookie is present, redirect to login
  if (!user && !isGuestMode) {
    redirect("/login");
  }

  // Check if onboarding is complete for registered users
  if (user && !isGuestMode) {
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
    <div className="flex h-screen overflow-hidden bg-[#f8fafc] text-slate-900 font-sans">
      <Sidebar />
      <div className="flex-1 md:ml-64 flex flex-col h-screen relative">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          {children}
        </main>
        <AICopilot />
      </div>
    </div>
  );
}
