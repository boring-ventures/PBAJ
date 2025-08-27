import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Redirect all dashboard access to admin panel
  redirect("/admin");
}
