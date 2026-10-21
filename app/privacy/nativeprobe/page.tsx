import {
  GameLanguageProvider,
  L,
  LanguageSwitch,
} from "@/components/games/game-language";
import { brand } from "@/lib/brand";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

const color = brand.colors.blue[400];

export const metadata: Metadata = {
  title: "Confidentialité — NativeProbe | Randy Code",
  description:
    "Politique de confidentialité de NativeProbe : aucune donnée envoyée au développeur, permissions utilisées uniquement pour les démonstrations, rapport de capacités partagé uniquement à votre initiative.",
  alternates: { canonical: "/privacy/nativeprobe" },
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

export default function NativeProbePrivacyPage() {
  return (
    <GameLanguageProvider>
      <main className="flex-1 px-6 pt-8 pb-16">
        <div className="mx-auto w-full max-w-5xl">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Link
              href="/projects/nativeprobe"
              className="inline-flex items-center gap-1.5 text-xs text-zinc-400 transition-colors hover:text-zinc-300"
            >
              <ArrowLeft size={12} />
              NativeProbe
            </Link>
            <LanguageSwitch color={color} />
          </div>

          <header className="mt-8">
            <h1 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
              <L fr="Politique de confidentialité" en="Privacy policy" />
            </h1>
            <p className="mt-2 text-sm text-zinc-400">
              NativeProbe · <L fr="Mise à jour le " en="Last updated " />
              <time dateTime="2026-10-21">
                <L fr="21 octobre 2026" en="October 21, 2026" />
              </time>
            </p>
          </header>

          <Block title={<L fr="Éditeur" en="Publisher" />}>
            <p>
              <L
                fr="NativeProbe est édité par Randy Code. Pour toute question relative à cette politique ou à vos données, écrivez à "
                en="NativeProbe is published by Randy Code. For any question about this policy or your data, write to "
              />
              <a
                href="mailto:contact@randy-code.dev"
                className="underline underline-offset-2 hover:text-white"
              >
                contact@randy-code.dev
              </a>
              .
            </p>
          </Block>

          <Block title={<L fr="L'essentiel" en="In short" />}>
            <p>
              <L
                fr="NativeProbe fonctionne sans compte, sans serveur, sans synchronisation cloud, sans publicité et sans outil d'analyse. L'application ne collecte ni ne transmet aucune donnée vers un serveur du développeur."
                en="NativeProbe works without an account, a server, cloud sync, ads or analytics. The app does not collect or transmit any data to a server operated by the developer."
              />
            </p>
            <p>
              <L
                fr="C'est une application de démonstration : elle lit des informations de votre appareil uniquement pour les afficher à l'écran, sur l'appareil."
                en="It is a demo app: it reads information from your device only to display it on screen, on the device."
              />
            </p>
          </Block>

          <Block
            title={
              <L
                fr="Informations de l'appareil affichées"
                en="Device information displayed"
              />
            }
          >
            <p>
              <L
                fr="Selon les modules que vous ouvrez, l'application lit et affiche des informations sur votre appareil : modèle et version du système, écran, batterie, capteurs de mouvement, état de la connexion réseau et adresse IP locale. Ces informations restent sur l'appareil et ne sont pas transmises."
                en="Depending on the modules you open, the app reads and displays information about your device: model and OS version, display, battery, motion sensors, network connection status and local IP address. This information stays on the device and is not transmitted."
              />
            </p>
          </Block>

          <Block
            title={<L fr="Autorisations Android" en="Android permissions" />}
          >
            <p>
              <L
                fr="Localisation (approximative et précise) : demandée uniquement pour la démonstration du module Location, et utilisée seulement lorsque l'application est au premier plan. La position n'est ni enregistrée ni envoyée."
                en="Location (approximate and precise): requested only for the Location module demo, and used only while the app is in the foreground. The position is neither stored nor sent."
              />
            </p>
            <p>
              <L
                fr="Biométrie : le module Biometrics déclenche l'authentification du système (empreinte ou visage) pour la démonstration. L'application ne reçoit aucune donnée biométrique, seulement le résultat de l'authentification."
                en="Biometrics: the Biometrics module triggers the system authentication (fingerprint or face) for the demo. The app receives no biometric data, only the authentication result."
              />
            </p>
            <p>
              <L
                fr="Vous pouvez accorder ou retirer ces autorisations à tout moment dans les réglages Android de l'application."
                en="You can grant or revoke these permissions at any time in the app's Android settings."
              />
            </p>
          </Block>

          <Block title={<L fr="Presse-papiers" en="Clipboard" />}>
            <p>
              <L
                fr="L'application écrit dans le presse-papiers lorsque vous copiez le rapport de capacités. Elle ne lit jamais son contenu."
                en="The app writes to the clipboard when you copy the capability report. It never reads its content."
              />
            </p>
          </Block>

          <Block title={<L fr="Rapport de capacités" en="Capability report" />}>
            <p>
              <L
                fr="Le rapport de capacités est la seule information qui peut quitter l'application, et uniquement lorsque vous le copiez ou le partagez vous-même, via la feuille de partage du système. Il contient la plateforme, la version du système, le modèle de l'appareil, la version de l'application et la disponibilité de chaque capacité. Il ne contient ni position, ni contacts, ni contenu du presse-papiers, ni identifiant publicitaire."
                en="The capability report is the only information that can leave the app, and only when you copy or share it yourself, through the system share sheet. It contains the platform, OS version, device model, app version and the availability of each capability. It contains no location, contacts, clipboard content or advertising identifier."
              />
            </p>
            <p>
              <L
                fr="Ce que vous faites ensuite de ce rapport (application de messagerie, e-mail, etc.) relève de l'application que vous choisissez."
                en="What you then do with the report (messaging app, email, etc.) is up to the app you choose."
              />
            </p>
          </Block>

          <Block title={<L fr="Services tiers" en="Third parties" />}>
            <p>
              <L
                fr="L'application n'intègre ni outil d'analyse, ni publicité, ni service de rapport de plantage. Si vous l'installez depuis Google Play, le magasin peut collecter des informations techniques selon sa propre politique de confidentialité ; nous n'y avons accès que sous forme agrégée, via la console développeur."
                en="The app includes no analytics, advertising or crash-reporting service. If you install it from Google Play, the store may collect technical information under its own privacy policy; we only have access to it in aggregated form, through the developer console."
              />
            </p>
          </Block>

          <Block title={<L fr="Code source ouvert" en="Open source" />}>
            <p>
              <L
                fr="Le code de NativeProbe est public : vous pouvez vérifier ces affirmations sur "
                en="NativeProbe's code is public: you can check these statements on "
              />
              <a
                href="https://github.com/Randy-R-code/nativeprobe"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:text-white"
              >
                GitHub
              </a>
              .
            </p>
          </Block>

          <Block title={<L fr="Vos droits" en="Your rights" />}>
            <p>
              <L
                fr="L'application ne collectant pas de données vous concernant côté développeur, nous ne conservons aucune donnée à votre sujet. Vous pouvez néanmoins nous contacter à l'adresse ci-dessus pour toute question ou demande d'accès, de rectification ou de suppression. Désinstaller l'application supprime ses données locales."
                en="As the app does not collect data about you on the developer side, we hold no data about you. You can still contact us at the address above with any question or request for access, correction or deletion. Uninstalling the app removes its local data."
              />
            </p>
          </Block>

          <Block title={<L fr="Modifications" en="Changes" />}>
            <p>
              <L
                fr="Cette politique peut évoluer avec l'application. La date de dernière mise à jour figure en haut de cette page."
                en="This policy may change as the app evolves. The date of the last update is shown at the top of this page."
              />
            </p>
          </Block>
        </div>
      </main>
    </GameLanguageProvider>
  );
}
