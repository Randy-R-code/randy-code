"use server";

import { checkRateLimit } from "@/lib/rate-limit";
import { getClientIdentifier } from "@/lib/rate-limit/identifier";
import { headers } from "next/headers";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// `name` is interpolated into the outbound email's Subject header below —
// CRLF in that value could inject extra headers. `email` is already safe
// (its regex below has no \s allowance).
const noControlChars = /^[^\r\n\0]*$/;

const MAX_NAME_LENGTH = 100;
const MAX_EMAIL_LENGTH = 254; // RFC 5321 §4.5.3.1.3
const MAX_MESSAGE_LENGTH = 5000;

/** A human can't realistically read the form and fill 3 fields faster than this — a submission under it is treated the same as a filled honeypot. */
const MIN_FILL_TIME_MS = 2000;

export interface ContactState {
  success?: boolean;
  error?: string;
}

export async function sendContact(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const name = formData.get("name")?.toString().trim();
  const email = formData.get("email")?.toString().trim();
  const message = formData.get("message")?.toString().trim();

  // Honeypot: real visitors never see or fill this field (see
  // ContactForm's `aria-hidden`/off-screen "company" input). A bot that
  // blindly fills every field trips it. Same for a submission that arrives
  // faster than a human could plausibly fill the form. Both are answered
  // with a fake success — never tip off the bot that it was detected.
  const honeypot = formData.get("company")?.toString().trim();
  const startedAt = Number(formData.get("startedAt"));
  const fillTimeMs = Date.now() - startedAt;
  if (
    honeypot ||
    !Number.isFinite(fillTimeMs) ||
    fillTimeMs < MIN_FILL_TIME_MS
  ) {
    return { success: true };
  }

  if (!name || !email || !message) {
    return { error: "Tous les champs sont obligatoires." };
  }

  if (
    name.length > MAX_NAME_LENGTH ||
    email.length > MAX_EMAIL_LENGTH ||
    message.length > MAX_MESSAGE_LENGTH
  ) {
    return { error: "Un des champs dépasse la longueur autorisée." };
  }

  if (!noControlChars.test(name)) {
    return { error: "Caractères invalides dans le nom." };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "Adresse email invalide." };
  }

  const identifier = getClientIdentifier(await headers());
  const rateLimit = await checkRateLimit("contact", identifier);
  if (!rateLimit.allowed) {
    return {
      error:
        "Trop de messages ont été envoyés récemment. Réessayez dans quelques minutes.",
    };
  }

  const { error: resendError } = await resend.emails.send({
    from: "Randy Code <noreply@randy-code.dev>",
    to: process.env.CONTACT_EMAIL ?? "randy.rcode@gmail.com",
    replyTo: email,
    subject: `[Randy Code] Message de ${name}`,
    text: `Nom : ${name}\nEmail : ${email}\n\n${message}`,
  });

  if (resendError) {
    return { error: "Une erreur est survenue. Réessayez plus tard." };
  }

  return { success: true };
}
