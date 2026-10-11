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
                fr="Version en cours de vérification avant la publication du jeu sur les stores."
                en="Version under review before the game's store release."
              />
            </p>
          )}

          <Block title={<L fr="Éditeur" en="Publisher" />}>
            <p>
              <L
                fr="As It Should Be est édité par Randy Code. Pour toute question relative à cette politique ou à vos données, écrivez à "
                en="As It Should Be is published by Randy Code. For any question about this policy or your data, write to "
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

          <Block title={<L fr="L'essentiel" en="In short" />}>
            <p>
              <L
                fr="As It Should Be fonctionne sans compte, sans publicité, sans achat intégré et sans outil d'analyse. Le jeu n'envoie aucune donnée vers nos serveurs ni vers des services tiers."
                en="As It Should Be works without an account, without ads, without in-app purchases and without analytics. The game does not send any data to our servers or to third-party services."
              />
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
                fr="Le jeu enregistre uniquement, sur votre appareil, votre progression (niveaux résolus et meilleurs scores) et la langue choisie. Ces informations servent uniquement au fonctionnement du jeu et ne sont jamais transmises par le jeu. Vous pouvez les supprimer à tout moment en effaçant les données de l'application ou en la désinstallant."
                en="The game only stores, on your device, your progress (solved levels and best scores) and your chosen language. This information is used only to run the game and is never transmitted by the game. You can delete it at any time by clearing the app's data or uninstalling it."
              />
            </p>
          </Block>

          <Block title={<L fr="Sauvegarde Android" en="Android backup" />}>
            <p>
              <L
                fr="Sur Android, la progression et la langue peuvent être incluses dans la sauvegarde automatique de votre appareil (Sauvegarde Google). Cette sauvegarde est gérée par Google selon les réglages de votre appareil et de votre compte : nous n'y avons pas accès."
                en="On Android, your progress and language may be included in your device's automatic backup (Google Backup). This backup is handled by Google according to your device and account settings: we have no access to it."
              />
            </p>
          </Block>

          <Block title={<L fr="Autorisations" en="Permissions" />}>
            <p>
              <L
                fr="Le jeu n'utilise ni la caméra, ni le micro, ni la localisation, ni les contacts, ni le stockage partagé de votre appareil. Il utilise la vibration pour le retour haptique."
                en="The game does not use your camera, microphone, location, contacts or shared storage. It uses vibration for haptic feedback."
              />
            </p>
          </Block>

          <Block title={<L fr="Google Play" en="Google Play" />}>
            <p>
              <L
                fr="Si vous installez le jeu depuis Google Play, le magasin peut collecter des informations techniques (installations, rapports de plantage) selon sa propre politique de confidentialité. Nous n'y avons accès que sous forme agrégée, via la console développeur."
                en="If you install the game from Google Play, the store may collect technical information (installs, crash reports) under its own privacy policy. We only have access to it in aggregated form, through the developer console."
              />
            </p>
          </Block>

          <Block title={<L fr="Vos droits" en="Your rights" />}>
            <p>
              <L
                fr="Le jeu ne collectant pas de données personnelles, nous ne conservons aucune donnée vous concernant. Vous pouvez néanmoins nous contacter à l'adresse ci-dessus pour toute question ou demande d'accès, de rectification ou de suppression."
                en="As the game does not collect personal data, we hold no data about you. You can still contact us at the address above with any question or request for access, correction or deletion."
              />
            </p>
          </Block>

          <Block title={<L fr="Modifications" en="Changes" />}>
            <p>
              <L
                fr="Cette politique peut évoluer avec le jeu. La date de dernière mise à jour figure en haut de cette page."
                en="This policy may change as the game evolves. The date of the last update is shown at the top of this page."
              />
            </p>
          </Block>
        </div>
      </main>
    </GameLanguageProvider>
  );
}
