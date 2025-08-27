import { redirect } from "next/navigation";

export default function DashboardPage() {
  // Redirect to admin panel
  redirect("/admin");
} 