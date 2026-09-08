import React from "react";
import { ThemeProvider } from "@/components/ThemeProvider";
import DashboardShell from "@/components/DashboardShell";
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
    <ThemeProvider>
      <DashboardShell>
        {children}
      </DashboardShell>
    </ThemeProvider>
  );
}

