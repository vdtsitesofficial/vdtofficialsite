import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { adminGate } from "@/lib/admin";
import AdminLogin from "@/components/admin/AdminLogin";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin sign-in",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  // Already signed in? Skip the form.
  const gate = await adminGate();
  if (gate.ok) redirect("/admin");
  return <AdminLogin />;
}
