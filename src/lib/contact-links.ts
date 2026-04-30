export const DEFAULT_CONTACT = {
  email: "contact@groupe-hn.com",
  phone: "0668546358",
  whatsapp: "0668546358",
  calendly: "",
};

export const WHATSAPP_MESSAGE = "Hi HN-GROUPE, I would like to discuss a project.";

export function normalizePhone(raw: string, defaultCountryCode = "212"): string {
  const trimmed = raw.trim();
  if (!trimmed) return "";

  try {
    const url = new URL(trimmed.startsWith("http") ? trimmed : `https://${trimmed}`);
    const phoneParam = url.searchParams.get("phone");
    if (phoneParam) return normalizePhone(phoneParam, defaultCountryCode);
    if (url.hostname.includes("wa.me")) return normalizePhone(url.pathname, defaultCountryCode);
  } catch {
    // Not a URL; treat as a plain phone number.
  }

  const digits = trimmed.replace(/\D/g, "");
  if (!digits) return "";
  if (digits.startsWith("00")) return digits.slice(2);
  if (digits.startsWith("0")) return `${defaultCountryCode}${digits.slice(1)}`;
  return digits;
}

export function buildWhatsAppUrl(rawPhone: string, message = WHATSAPP_MESSAGE): string {
  const phone = normalizePhone(rawPhone) || normalizePhone(DEFAULT_CONTACT.whatsapp);
  const text = encodeURIComponent(message);
  return `https://api.whatsapp.com/send?phone=${phone}&text=${text}&type=phone_number&app_absent=0`;
}

export function buildTelHref(rawPhone: string): string {
  const phone = normalizePhone(rawPhone);
  return phone ? `tel:+${phone}` : "";
}

export function normalizeExternalUrl(raw: string): string {
  const value = raw.trim();
  if (!value || value === "#") return "";
  if (/^(https?:|mailto:|tel:)/i.test(value)) return value;
  return `https://${value.replace(/^\/+/, "")}`;
}