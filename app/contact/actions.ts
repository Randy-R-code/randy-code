"use server";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// `name` is interpolated into the outbound email's Subject header below —
// CRLF in that value could inject extra headers. `email` is already safe
// (its regex below has no \s allowance).
const noControlChars = /^[^\r\n\0]*$/;

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

  if (!name || !email || !message) {
    return { error: "Tous les champs sont obligatoires." };
  }

  if (!noControlChars.test(name)) {
    return { error: "Caractères invalides dans le nom." };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "Adresse email invalide." };
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
