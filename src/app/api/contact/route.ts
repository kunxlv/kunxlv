import { NextResponse } from "next/server";

const clean = (v: unknown, max: number) => String(v ?? "").trim().slice(0, max);

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid request." }, { status: 400 }); }
  if (clean(body.company, 100)) return NextResponse.json({ ok: true }); // honeypot

  const name = clean(body.name, 120);
  const email = clean(body.email, 200);
  const message = clean(body.message, 5000);
  const topic = clean(body.topic, 60);
  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !message) {
    return NextResponse.json({ error: "Please add your name, a valid email and a message." }, { status: 400 });
  }

  const key = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  if (!key || !to) {
    return NextResponse.json({ error: "The form isn't connected yet. Please email me directly." }, { status: 503 });
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { authorization: `Bearer ${key}`, "content-type": "application/json" },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM_EMAIL ?? "kunalv.com <contact@kunalv.com>",
      to: [to],
      reply_to: email,
      subject: `[kunalv.com] ${topic || "Message"} from ${name}`,
      text: `${message}\n\n— ${name} <${email}>\nTopic: ${topic || "n/a"}`,
    }),
  });
  if (!res.ok) return NextResponse.json({ error: "Couldn't send right now. Please email me directly." }, { status: 502 });
  return NextResponse.json({ ok: true });
}
