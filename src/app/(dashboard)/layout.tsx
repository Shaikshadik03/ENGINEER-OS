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
    <div className="flex h-screen overflow-hidden bg-[#07070a] text-slate-100 font-sans relative selection:bg-emerald-500 selection:text-black">
      {/* Dark Cosmic Glow Gradients matching shadik.lovable.app */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 opacity-80"
        style={{
          backgroundImage: `
            radial-gradient(circle at 85% 15%, rgba(147, 51, 234, 0.22), transparent 50%),
            radial-gradient(circle at 45% 10%, rgba(16, 185, 129, 0.18), transparent 45%),
            radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.15), transparent 50%)
          `
        }}
      />

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
