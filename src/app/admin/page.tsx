import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { adminGate, listMessages } from "@/lib/admin";
import AdminDashboard from "@/components/admin/AdminDashboard";

// Always render fresh: the admin must reflect current KV state, and it
// must never be statically cached or indexed.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const gate = await adminGate();
  if (!gate.ok) redirect("/admin/login");

  const messages = await listMessages();
  return <AdminDashboard email={gate.email} messages={messages} />;
}
