import { NextResponse } from "next/server";
import { z } from "zod";
import { site } from "@/lib/site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const schema = z.object({
  name: z.string().trim().min(2).max(120),
  company: z.string().trim().max(160).optional().or(z.literal("")),
  email: z.string().trim().email().max(160),
  phone: z.string().trim().max(60).optional().or(z.literal("")),
  subject: z.enum(["billets", "scrap", "other"]).default("other"),
  alloy: z.string().trim().max(20).optional().or(z.literal("")),
  diameter: z.string().trim().max(20).optional().or(z.literal("")),
  length: z.string().trim().max(20).optional().or(z.literal("")),
  quantity: z.string().trim().max(20).optional().or(z.literal("")),
  message: z.string().trim().min(10).max(4000),
  locale: z.enum(["bg", "en", "tr"]).default("bg"),
  /** honeypot — must stay empty */
  website: z.string().max(0).optional().or(z.literal("")),
});

/** Small in-memory throttle: enough to stop a script, forgotten on restart. */
const hits = new Map<string, number[]>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > MAX_PER_WINDOW;
}

function textBody(d: z.infer<typeof schema>) {
  const rows: [string, string | undefined][] = [
    ["Name", d.name],
    ["Company", d.company],
    ["Email", d.email],
    ["Phone", d.phone],
    ["Subject", d.subject],
    ["Alloy", d.alloy],
    ["Diameter", d.diameter && `${d.diameter} mm`],
    ["Length", d.length && `${d.length} mm`],
    ["Quantity", d.quantity && `${d.quantity} t`],
    ["Language", d.locale],
  ];
  return [
    ...rows.filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`),
    "",
    d.message,
  ].join("\n");
}

/**
 * Delivery is optional on purpose: without mail credentials the inquiry is
 * still accepted and logged, so the form never dead-ends while the mailbox
 * is being set up. Set RESEND_API_KEY + INQUIRY_TO to have it delivered.
 */
async function deliver(d: z.infer<typeof schema>) {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.INQUIRY_TO ?? site.email;
  const from = process.env.INQUIRY_FROM ?? `AIZEN METAL <onboarding@resend.dev>`;
  if (!key) return { delivered: false, reason: "no RESEND_API_KEY" };

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      authorization: `Bearer ${key}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: d.email,
      subject: `Запитване · ${d.subject} · ${d.company || d.name}`,
      text: textBody(d),
    }),
  });

  if (!res.ok) {
    return { delivered: false, reason: `resend ${res.status}: ${await res.text()}` };
  }
  return { delivered: true };
}

export async function POST(req: Request) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  if (rateLimited(ip)) {
    return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });
  }

  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad_json" }, { status: 400 });
  }

  const parsed = schema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "invalid", issues: parsed.error.issues.map((i) => i.path.join(".")) },
      { status: 422 },
    );
  }

  // honeypot filled in → accept silently, deliver nothing
  if (parsed.data.website) {
    return NextResponse.json({ ok: true });
  }

  const result = await deliver(parsed.data);
  if (!result.delivered) {
    console.warn(
      `[inquiry] not delivered (${result.reason}) — from ${parsed.data.email}\n${textBody(parsed.data)}`,
    );
  } else {
    console.info(`[inquiry] delivered — from ${parsed.data.email}`);
  }

  return NextResponse.json({ ok: true });
}
