import { createHash } from "node:crypto";
import { Resend } from "resend";
import { validateContact } from "@/lib/contact";

export const runtime = "nodejs";
const WINDOW_MS = 15 * 60 * 1000;
// This simple limiter is process-local. Use a shared store before scaling to multiple instances.
const buckets = new Map<string, { count: number; expires: number }>();
function limited(key: string, maximum: number) {
  const now = Date.now();
  for (const [id, value] of buckets) if (value.expires <= now) buckets.delete(id);
  const bucket = buckets.get(key) ?? { count: 0, expires: now + WINDOW_MS };
  bucket.count += 1;
  buckets.set(key, bucket);
  return bucket.count > maximum;
}
function fail(error: string, status: number, headers?: HeadersInit) {
  return Response.json({ error }, { status, headers });
}

export async function POST(request: Request) {
  if (limited("all-requests", 60)) return fail("Trop de demandes. Réessayez dans 15 minutes ou appelez-nous.", 429, { "Retry-After": "900" });
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) return fail("Format de requête invalide.", 415);
  const origin = request.headers.get("origin");
  if (origin) {
    try {
      if (new URL(origin).host !== request.headers.get("host")) return fail("Origine de la demande non autorisée.", 403);
    } catch { return fail("Origine de la demande invalide.", 403); }
  }
  let payload: unknown;
  try {
    const reader = request.body?.getReader();
    if (!reader) return fail("Requête vide.", 400);
    const chunks: Uint8Array[] = [];
    let length = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      length += value.length;
      if (length > 24000) { await reader.cancel(); return fail("Votre demande est trop longue.", 413); }
      chunks.push(value);
    }
    payload = JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch { return fail("Requête invalide.", 400); }
  const { data: contact, errors } = validateContact(payload);
  if (!contact) return Response.json({ error: "Vérifiez les informations de votre demande.", errors }, { status: 400 });
  const sender = process.env.CONTACT_FROM_EMAIL;
  const recipient = process.env.CONTACT_EMAIL;
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || !recipient || !sender) return fail("L’envoi est momentanément indisponible. Contactez-nous par téléphone ou par e-mail.", 503);
  const emailKey = createHash("sha256").update(contact.email).digest("hex");
  if (limited("email:" + emailKey, 3)) return fail("Vous avez déjà envoyé plusieurs demandes. Réessayez dans 15 minutes ou appelez-nous.", 429, { "Retry-After": "900" });
  try {
    const resend = new Resend(apiKey);
    const kind = contact.requestType === "rendez-vous" ? "rendez-vous" : "devis";
    const { data, error } = await resend.emails.send({
      from: sender,
      to: recipient,
      replyTo: contact.email,
      subject: "Nouvelle demande de " + kind + " — NC’ELEC",
      text: [
        "NC’ELEC — Nouvelle demande de " + kind,
        "", "Nature de la demande : " + kind,
        "Nom : " + contact.name, "Téléphone : " + contact.phone,
        "Adresse e-mail : " + contact.email, "Type de projet : " + contact.projectType,
        "", "Description du projet :", contact.message,
        "", kind === "rendez-vous" ? "Demande de rendez-vous uniquement : aucun créneau n’est réservé." : "",
      ].join("\n"),
    }, { idempotencyKey: "contact/" + contact.requestId });
    if (error || !data?.id) {
      // Only a diagnostic code: no visitor data, API key or provider response in logs.
      console.error("Contact: Resend rejected the request.", error?.name ?? "missing_id");
      return fail("L’envoi n’a pas été accepté. Vos informations sont conservées. Réessayez ou appelez-nous.", 502);
    }
    return Response.json({ success: true, status: "accepted", id: data.id });
  } catch {
    console.error("Contact: email service unavailable.");
    return fail("Le service d’envoi est indisponible. Vos informations sont conservées. Réessayez ou appelez-nous.", 502);
  }
}
