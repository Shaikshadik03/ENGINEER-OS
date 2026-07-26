import { redirect } from "next/navigation";

// /dashboard just renders the existing (dashboard) root page
export default function DashboardPage() {
  redirect("/");
}
