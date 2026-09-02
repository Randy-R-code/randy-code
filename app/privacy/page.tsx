import { PageShell } from "@/components/layout/page-shell";
import { brand } from "@/lib/brand";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Confidentialité — Randy Code",
  description:
    "Mentions légales et politique de confidentialité de randy-code.dev : éditeur, hébergeur, données traitées et droits RGPD.",
  alternates: { canonical: "/privacy" },
};

function Block({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-8">
      <h2 className="mb-3 text-xl font-semibold text-white">{title}</h2>
      <div
        className="space-y-3 rounded-xl border p-6 text-sm leading-relaxed text-zinc-400"
        style={{
          borderColor: `${brand.colors.blue[400]}18`,
          background: brand.colors.surface[2],
        }}
      >
        {children}
      </div>
    </section>
  );
}

export default function ConfidentialitePage() {
  return (
    <PageShell
      label="Légal"
      title="Confidentialité"
      tagline="Éditeur, hébergeur, données traitées et vos droits — en clair."
      color={brand.colors.blue[400]}
      icon="shield"
    >
      <Block title="Éditeur du site">
        <p>
          Ce site est publié par{" "}
          <span className="font-medium text-zinc-200">Randy Rimbault</span>.
          Contact :{" "}
          <a
            href="mailto:randy.rcode@gmail.com"
            className="text-blue-400 underline underline-offset-2 hover:text-blue-300"
          >
            randy.rcode@gmail.com
          </a>
          .
        </p>
      </Block>

      <Block title="Hébergement">
        <p>
          Le site est hébergé par{" "}
          <span className="font-medium text-zinc-200">Vercel Inc.</span>, 440 N
          Barranca Avenue #4133, Covina, CA 91723, États-Unis.
        </p>
      </Block>

      <Block title="Sous-traitants et services tiers">
        <p>Trois services tiers traitent des données dans le cadre du site :</p>
        <ul className="space-y-1.5">
          <li className="flex items-start gap-2">
            <span className="mt-0.5 text-zinc-500">—</span>
            <span>
              <span className="font-medium text-zinc-200">Vercel</span> —
              hébergement, Web Analytics et Speed Insights.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5 text-zinc-500">—</span>
            <span>
              <span className="font-medium text-zinc-200">Resend</span> — envoi
              de l&apos;email généré par le formulaire de contact.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5 text-zinc-500">—</span>
            <span>
              <span className="font-medium text-zinc-200">Upstash</span> —
              limitation de débit (anti-abus) sur le formulaire de contact et
              les outils du site.
            </span>
          </li>
        </ul>
      </Block>

      <Block title="Données traitées et finalités">
        <p>
          <span className="font-medium text-zinc-200">
            Formulaire de contact
          </span>{" "}
          — nom, email et message, transmis via Resend, uniquement pour répondre
          à votre demande.
        </p>
        <p>
          <span className="font-medium text-zinc-200">Web Analytics</span> —
          pages consultées, référents et informations agrégées
          (pays/appareil/navigateur), collectées par Vercel sans cookies tiers
          et avec une identification visiteur anonymisée et effacée sous 24h,
          pour comprendre l&apos;usage du site.
        </p>
        <p>
          <span className="font-medium text-zinc-200">Speed Insights</span> —
          métriques de performance de chargement des pages (Core Web Vitals),
          collectées par Vercel sans cookies ni identification du visiteur, pour
          suivre la performance du site.
        </p>
        <p>
          <span className="font-medium text-zinc-200">Adresse IP</span> —
          utilisée uniquement comme clé de limitation de débit (anti-abus) via
          Upstash, pour le formulaire de contact et les outils (InfraLens,
          MetaLens, API Studio…), jamais associée à d&apos;autre donnée ni
          conservée au-delà de la fenêtre décrite ci-dessous.
        </p>
      </Block>

      <Block title="Durée de conservation">
        <ul className="space-y-1.5">
          <li className="flex items-start gap-2">
            <span className="mt-0.5 text-zinc-500">—</span>
            <span>
              Messages de contact : conservés dans la boîte mail le temps
              nécessaire au traitement de la demande.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5 text-zinc-500">—</span>
            <span>
              Limitation de débit (Upstash) : effacée automatiquement sous 24h
              maximum, sans intervention.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5 text-zinc-500">—</span>
            <span>
              Web Analytics : identification visiteur effacée sous 24h, données
              de trafic conservées 1 mois.
            </span>
          </li>
        </ul>
      </Block>

      <Block title="Vos droits">
        <p>
          Conformément au RGPD, vous disposez d&apos;un droit d&apos;accès, de
          rectification et de suppression des données vous concernant. Pour
          l&apos;exercer, écrivez à{" "}
          <a
            href="mailto:randy.rcode@gmail.com"
            className="text-blue-400 underline underline-offset-2 hover:text-blue-300"
          >
            randy.rcode@gmail.com
          </a>
          . Vous pouvez aussi introduire une réclamation auprès de la CNIL
          (cnil.fr).
        </p>
      </Block>

      <Block title="Cookies">
        <p>
          Le site n&apos;utilise aucun cookie tiers. Vercel Web Analytics et
          Speed Insights fonctionnent sans cookie ; aucune bannière de
          consentement n&apos;est donc nécessaire.
        </p>
      </Block>
    </PageShell>
  );
}
