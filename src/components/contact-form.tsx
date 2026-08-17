"use client";

import { brand } from "@/lib/brand";
import { sendContact, type ContactState } from "@app/contact/actions";
import { useActionState, useState } from "react";

const initial: ContactState = {};

export function ContactForm() {
  const [state, action, pending] = useActionState(sendContact, initial);
  // Captured once at mount, read server-side to reject submissions faster
  // than a human could plausibly fill the form (see actions.ts).
  const [startedAt] = useState(() => Date.now());

  if (state.success) {
    return (
      <div
        className="rounded-xl border p-6 text-center"
        style={{
          borderColor: `${brand.colors.green[500]}30`,
          background: brand.colors.surface[2],
        }}
      >
        <p className="text-sm font-medium text-white">Message envoyé ✓</p>
        <p className="mt-1 text-xs text-zinc-400">
          Je vous réponds dans les plus brefs délais.
        </p>
      </div>
    );
  }

  return (
    <form action={action} className="flex flex-col gap-4">
      <input type="hidden" name="startedAt" value={startedAt} />
      {/* Honeypot — invisible and unreachable for a real visitor (off-screen,
          aria-hidden, not tab-focusable); a bot that fills every input by DOM
          structure trips it. Server treats a filled value as spam and fakes
          a success response instead of revealing the check. */}
      <div
        aria-hidden="true"
        className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden"
      >
        <label htmlFor="company">Company</label>
        <input
          id="company"
          name="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="name" className="text-xs font-medium text-zinc-400">
            Nom
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            maxLength={100}
            placeholder="Randy Rimbault"
            className="rounded-lg border px-3 py-2.5 text-sm text-white placeholder:text-zinc-400 focus:outline-none focus:ring-1"
            style={
              {
                background: brand.colors.surface[1],
                borderColor: `${brand.colors.blue[400]}18`,
                "--tw-ring-color": `${brand.colors.blue[400]}60`,
              } as React.CSSProperties
            }
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-xs font-medium text-zinc-400">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            maxLength={254}
            placeholder="vous@exemple.com"
            className="rounded-lg border px-3 py-2.5 text-sm text-white placeholder:text-zinc-400 focus:outline-none focus:ring-1"
            style={
              {
                background: brand.colors.surface[1],
                borderColor: `${brand.colors.blue[400]}18`,
                "--tw-ring-color": `${brand.colors.blue[400]}60`,
              } as React.CSSProperties
            }
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="message" className="text-xs font-medium text-zinc-400">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          maxLength={5000}
          placeholder="Décrivez votre projet ou votre question..."
          className="resize-none rounded-lg border px-3 py-2.5 text-sm text-white placeholder:text-zinc-400 focus:outline-none focus:ring-1"
          style={
            {
              background: brand.colors.surface[1],
              borderColor: `${brand.colors.blue[400]}18`,
              "--tw-ring-color": `${brand.colors.blue[400]}60`,
            } as React.CSSProperties
          }
        />
      </div>

      {state.error && <p className="text-xs text-red-400">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="self-start rounded-lg px-5 py-2.5 text-sm font-medium transition-opacity hover:opacity-80 disabled:opacity-50"
        style={{
          backgroundColor: `${brand.colors.blue[400]}20`,
          color: brand.colors.blue[400],
          border: `1px solid ${brand.colors.blue[400]}30`,
        }}
      >
        {pending ? "Envoi en cours…" : "Envoyer le message →"}
      </button>
    </form>
  );
}
