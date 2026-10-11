import {
  GameLanguageProvider,
  L,
  LanguageSwitch,
} from "@/components/games/game-language";
import { brand } from "@/lib/brand";
import { getGame } from "@/lib/games";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

const game = getGame("as-it-should-be");
const color = brand.colors.violet[400];

export const metadata: Metadata = {
  title: "Confidentialité — As It Should Be | Randy Code",
  description:
    "Politique de confidentialité du jeu mobile As It Should Be : données stockées sur l'appareil, contact et droits des utilisateurs.",
  alternates: { canonical: "/games/as-it-should-be/privacy" },
  robots: game?.privacyReviewed ? undefined : { index: false, follow: true },
};

function Block({
  title,
  children,
}: {
  title: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-10">
      <h2 className="mb-3 text-lg font-semibold text-white">{title}</h2>
      <div className="max-w-2xl space-y-3 text-sm leading-relaxed text-zinc-300">
        {children}
      </div>
    </section>
  );
}

export default function AsItShouldBePrivacyPage() {
  if (!game) notFound();

  return (
    <GameLanguageProvider>
      <main className="flex-1 px-6 pt-8 pb-16">
        <div className="mx-auto w-full max-w-5xl">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Link
              href="/games/as-it-should-be"
              className="inline-flex items-center gap-1.5 text-xs text-zinc-400 transition-colors hover:text-zinc-300"
            >
              <ArrowLeft size={12} />
              {game.name}
            </Link>
            <LanguageSwitch color={color} />
          </div>

          <header className="mt-8">
            <h1 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
              <L fr="Politique de confidentialité" en="Privacy policy" />
            </h1>
            <p className="mt-2 text-sm text-zinc-400">
              {game.name} · <L fr="Mise à jour le " en="Last updated " />
              <time dateTime="2026-10-11">
                <L fr="11 octobre 2026" en="October 11, 2026" />
              </time>
            </p>
          </header>

          {!game.privacyReviewed && (
            <p
              role="note"
              className="mt-6 max-w-3xl rounded-xl border p-4 text-sm leading-relaxed text-zinc-300"
              style={{
                borderColor: `${color}40`,
                background: `${color}0d`,
              }}
            >
              <L
                fr="Version provisoire : le jeu est en phase de test et cette politique sera complétée et vérifiée avant sa publication sur les stores."
                en="Provisional version: the game is in testing and this policy will be completed and verified before its store release."
              />
            </p>
          )}

          <Block title={<L fr="Éditeur" en="Publisher" />}>
            <p>
              <L
                fr="As It Should Be est édité par Randy Code. Pour toute question relative à vos données, écrivez à "
                en="As It Should Be is published by Randy Code. For any question about your data, write to "
              />
              <a
                href="mailto:support@randy-code.dev"
                className="underline underline-offset-2 hover:text-white"
              >
                support@randy-code.dev
              </a>
              .
            </p>
          </Block>

          <Block
            title={
              <L
                fr="Données stockées sur l'appareil"
                en="Data stored on your device"
              />
            }
          >
            <p>
              <L
                fr="Le jeu enregistre localement sur votre appareil votre progression (niveaux réussis, scores) et la langue choisie. Ces informations servent uniquement au fonctionnement du jeu."
                en="The game stores your progress (solved levels, scores) and your chosen language locally on your device. This information is used only to run the game."
              />
            </p>
          </Block>

          <Block
            title={
              <L
                fr="Données transmises à des tiers"
                en="Data shared with third parties"
              />
            }
          >
            <p>
              <L
                fr="Cette section sera précisée avec la version finale du jeu : elle indiquera les éventuelles données qui quittent l'appareil, les services concernés et leur finalité."
                en="This section will be specified with the final version of the game: it will state any data that leaves the device, the services involved and their purpose."
              />
            </p>
          </Block>

          <Block title={<L fr="Vos droits" en="Your rights" />}>
            <p>
              <L
                fr="Vous pouvez à tout moment nous contacter pour toute demande d'accès, de rectification ou de suppression de vos données, à l'adresse ci-dessus."
                en="You can contact us at any time for any request to access, correct or delete your data, at the address above."
              />
            </p>
          </Block>
        </div>
      </main>
    </GameLanguageProvider>
  );
}
