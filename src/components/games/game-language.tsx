"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Lang = "fr" | "en";

const LangContext = createContext<Lang>("fr");
const SetLangContext = createContext<(lang: Lang) => void>(() => {});

export function GameLanguageProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [lang, setLang] = useState<Lang>("fr");

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  return (
    <SetLangContext.Provider value={setLang}>
      <LangContext.Provider value={lang}>{children}</LangContext.Provider>
    </SetLangContext.Provider>
  );
}

export function LanguageSwitch({ color }: { color: string }) {
  const lang = useContext(LangContext);
  const setLang = useContext(SetLangContext);

  return (
    <div
      role="group"
      aria-label="Langue / Language"
      className="inline-flex rounded-lg border p-0.5 text-xs font-medium"
      style={{ borderColor: "var(--border-default)" }}
    >
      {(["fr", "en"] as const).map((value) => {
        const active = lang === value;
        return (
          <button
            key={value}
            type="button"
            aria-pressed={active}
            onClick={() => setLang(value)}
            className={`rounded-md px-3 py-1 uppercase tracking-wider transition-colors ${active ? "" : "text-zinc-400 hover:text-white"}`}
            style={
              active ? { backgroundColor: `${color}22`, color } : undefined
            }
          >
            {value}
          </button>
        );
      })}
    </div>
  );
}

export function L({ fr, en }: { fr: React.ReactNode; en: React.ReactNode }) {
  const lang = useContext(LangContext);
  return (
    <>
      <span lang="fr" hidden={lang !== "fr"}>
        {fr}
      </span>
      <span lang="en" hidden={lang !== "en"}>
        {en}
      </span>
    </>
  );
}

export function LBlock({
  fr,
  en,
  className,
}: {
  fr: React.ReactNode;
  en: React.ReactNode;
  className?: string;
}) {
  const lang = useContext(LangContext);
  return (
    <>
      <div lang="fr" hidden={lang !== "fr"} className={className}>
        {fr}
      </div>
      <div lang="en" hidden={lang !== "en"} className={className}>
        {en}
      </div>
    </>
  );
}
