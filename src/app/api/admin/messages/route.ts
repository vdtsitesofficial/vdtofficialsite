import { NextResponse } from "next/server";
import { adminGate, deleteMessage, listMessages } from "@/lib/admin";

// Always read fresh from KV; never cache the admin inbox.
export const dynamic = "force-dynamic";

/** List every stored contact message (newest first). */
export async function GET() {
  const gate = await adminGate();
  if (!gate.ok) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ messages: await listMessages() });
}

/** Delete a single message by id. */
export async function DELETE(req: Request) {
  const gate = await adminGate();
  if (!gate.ok) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = (await req.json().catch(() => ({}))) as { id?: string };
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }
  await deleteMessage(id);
  return NextResponse.json({ ok: true });
}
