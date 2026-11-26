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
    return NextResponse.json({ error: "Add your name, an email address I can reply to, and a message." }, { status: 400 });
  }

  const key = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  if (!key || !to) {
    return NextResponse.json({ error: "Messages can't be sent from this form yet. Email me at the address on this page instead." }, { status: 503 });
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
  if (!res.ok) return NextResponse.json({ error: "Your message didn't send. Try again in a minute, or email me at the address on this page." }, { status: 502 });
  return NextResponse.json({ ok: true });
}
