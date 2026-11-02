export const projectTypes = ["Installation électrique", "Dépannage", "Rénovation", "Mise aux normes", "Éclairage", "Maintenance", "Autre"] as const;
export type RequestType = "devis" | "rendez-vous";
export type ContactPayload = {
  name: string; phone: string; email: string; projectType: string;
  message: string; requestType: RequestType; website: string; requestId: string;
};
export type ContactErrors = Partial<Record<keyof ContactPayload, string>>;

export function validateContact(value: unknown): { data?: ContactPayload; errors: ContactErrors } {
  if (!value || typeof value !== "object" || Array.isArray(value)) return { errors: { name: "Requête invalide." } };
  const input = value as Record<string, unknown>;
  const text = (key: string) => typeof input[key] === "string" ? (input[key] as string).trim() : "";
  const data: ContactPayload = {
    name: text("name"), phone: text("phone"), email: text("email").toLowerCase(),
    projectType: text("projectType"), message: text("message"), website: text("website"),
    requestType: text("requestType") as RequestType, requestId: text("requestId"),
  };
  const errors: ContactErrors = {};
  if (data.name.length < 2 || data.name.length > 100 || /[\r\n]/.test(data.name)) errors.name = "Indiquez un nom de 2 à 100 caractères.";
  const digits = data.phone.replace(/\D/g, "");
  if (data.phone.length > 30 || !/^\+?[0-9 ().-]+$/.test(data.phone) || digits.length < 7 || digits.length > 15) errors.phone = "Indiquez un numéro valide (7 à 15 chiffres).";
  if (data.email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.email = "Indiquez une adresse e-mail valide.";
  if (!projectTypes.some((type) => type === data.projectType)) errors.projectType = "Choisissez un type de projet.";
  if (data.message.length < 10 || data.message.length > 4000) errors.message = "Décrivez votre projet en 10 à 4 000 caractères.";
  if (!["devis", "rendez-vous"].includes(data.requestType)) errors.requestType = "Choisissez la nature de votre demande.";
  if (data.website) errors.website = "La demande n’a pas pu être envoyée.";
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(data.requestId)) errors.requestId = "Veuillez actualiser la page puis réessayer.";
  return Object.keys(errors).length ? { errors } : { data, errors };
}
