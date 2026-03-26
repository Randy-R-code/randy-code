"use server";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

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

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "Adresse email invalide." };
  }

  try {
    await resend.emails.send({
      from: "Randy World <onboarding@resend.dev>",
      to: process.env.CONTACT_EMAIL ?? "randy.rcode@gmail.com",
      replyTo: email,
      subject: `[Randy World] Message de ${name}`,
      text: `Nom : ${name}\nEmail : ${email}\n\n${message}`,
    });

    return { success: true };
  } catch {
    return { error: "Une erreur est survenue. Réessayez plus tard." };
  }
}
