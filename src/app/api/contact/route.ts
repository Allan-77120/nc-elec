import { Resend } from "resend";

const projectTypes = new Set([
  "Installation électrique",
  "Dépannage",
  "Rénovation",
  "Mise aux normes",
  "Éclairage",
  "Autre",
]);

type ContactPayload = {
  name?: unknown;
  phone?: unknown;
  email?: unknown;
  projectType?: unknown;
  message?: unknown;
  website?: unknown;
};

function isText(value: unknown, maxLength: number) {
  return (
    typeof value === "string" &&
    value.trim().length > 0 &&
    value.trim().length <= maxLength
  );
}

export async function POST(request: Request) {
  let payload: ContactPayload;

  try {
    payload = (await request.json()) as ContactPayload;
  } catch {
    return Response.json({ error: "Requête invalide." }, { status: 400 });
  }

  if (typeof payload.website === "string" && payload.website.length > 0) {
    return Response.json({ success: true });
  }

  if (
    !isText(payload.name, 100) ||
    !isText(payload.phone, 30) ||
    !isText(payload.email, 254) ||
    !isText(payload.projectType, 100) ||
    !isText(payload.message, 4000)
  ) {
    return Response.json(
      { error: "Veuillez compléter correctement tous les champs." },
      { status: 400 },
    );
  }

  const name = (payload.name as string).trim();
  const phone = (payload.phone as string).trim();
  const email = (payload.email as string).trim().toLowerCase();
  const projectType = (payload.projectType as string).trim();
  const message = (payload.message as string).trim();

  if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    !projectTypes.has(projectType)
  ) {
    return Response.json(
      { error: "Adresse e-mail ou type de projet invalide." },
      { status: 400 },
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  const recipient = process.env.CONTACT_EMAIL;
  const sender = process.env.CONTACT_FROM_EMAIL;

  if (!apiKey || !recipient || !sender) {
    console.error("Missing contact email environment variables.");
    return Response.json(
      { error: "Le service d’envoi n’est pas encore configuré." },
      { status: 503 },
    );
  }

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from: sender,
    to: recipient,
    replyTo: email,
    subject: `Nouvelle demande de devis - ${projectType}`,
    text: [
      `Nom : ${name}`,
      `Téléphone : ${phone}`,
      `E-mail : ${email}`,
      `Type de projet : ${projectType}`,
      "",
      "Message :",
      message,
    ].join("\n"),
  });

  if (error) {
    console.error("Resend contact error:", error);
    return Response.json(
      { error: "L’envoi a échoué. Veuillez réessayer." },
      { status: 502 },
    );
  }

  return Response.json({ success: true });
}
