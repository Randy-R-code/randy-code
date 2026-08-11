# InfraLens — Plan maître d’amélioration produit, technique et open source

> Document de référence destiné à guider une IA de développement dans l’amélioration progressive d’InfraLens, sans transformer le projet en SaaS.

---

## 0. Rôle de ce document

Ce fichier constitue la source de vérité pour les prochaines évolutions du projet InfraLens.

L’IA doit l’utiliser pour :

- comprendre précisément la vision du produit ;
- préserver son positionnement d’outil gratuit, open source et sans compte ;
- améliorer l’expérience utilisateur sans ajouter de complexité inutile ;
- renforcer la sécurité des analyses serveur ;
- rendre les résultats plus fiables, explicables et exploitables ;
- améliorer la qualité du code, les tests et la documentation ;
- préparer l’intégration de la marque InfraLens dans l’écosystème Randy Code ;
- travailler phase par phase avec des critères de validation explicites ;
- éviter toute dérive vers une plateforme SaaS, un outil de monitoring ou une suite commerciale.

L’IA ne doit pas exécuter toutes les phases en une seule fois.

Chaque phase doit être :

1. auditée avant modification ;
2. réalisée dans un périmètre maîtrisé ;
3. testée ;
4. documentée ;
5. validée avant de passer à la suivante.

---

# 1. Contexte du projet

## 1.1 Nom du produit

Le produit doit être nommé :

> **InfraLens**

Le suffixe `.dev` correspond au domaine actuel, pas au nom de marque.

À terme, l’interface ne doit plus afficher `infralens.dev` comme logo principal ou nom de produit.

Formulations recommandées :

- InfraLens ;
- InfraLens — Website Infrastructure Inspector ;
- InfraLens — Open-source website inspection tool ;
- InfraLens by Randy Code.

Formulations à éviter :

- infralens.dev comme nom de produit ;
- scanner de sécurité complet ;
- audit de sécurité certifié ;
- outil de pentest ;
- plateforme de monitoring ;
- SaaS d’observabilité.

## 1.2 Positionnement

InfraLens est un outil web gratuit et open source permettant d’obtenir rapidement une vue lisible de la configuration technique publique d’un site.

Il analyse notamment :

- les redirections ;
- HTTPS et TLS ;
- les headers HTTP ;
- les principaux headers de sécurité ;
- les enregistrements DNS ;
- certains signaux de sécurité DNS ;
- l’adresse IP, l’ASN et l’hébergeur ;
- la présence d’un CDN ou WAF ;
- `robots.txt` ;
- les sitemaps ;
- les liens ;
- les métadonnées HTML ;
- Open Graph et les cartes sociales ;
- certains indices d’accessibilité ;
- les technologies détectables ;
- certains signaux légers de performance et de disponibilité.

InfraLens doit rester :

- passif ;
- non intrusif ;
- rapide ;
- lisible ;
- transparent ;
- gratuit ;
- utilisable sans compte ;
- utilisable sans fournir de données personnelles ;
- installable en PWA si cela reste fiable ;
- auto-hébergeable ;
- extensible par des contributeurs.

## 1.3 Public cible

Public principal :

- développeurs web ;
- freelances ;
- mainteneurs de sites ;
- créateurs de produits ;
- étudiants en développement ;
- personnes souhaitant comprendre rapidement la configuration publique d’un domaine.

Public secondaire :

- équipes techniques voulant effectuer une vérification ponctuelle ;
- propriétaires de sites souhaitant identifier des améliorations simples ;
- recruteurs ou développeurs consultant le projet comme démonstration technique.

InfraLens ne doit pas essayer de répondre aux besoins complexes de :

- centres opérationnels de sécurité ;
- équipes de pentest ;
- monitoring de disponibilité continu ;
- gestion de vulnérabilités ;
- conformité réglementaire ;
- gestion multi-utilisateur ;
- facturation ;
- alertes et notifications récurrentes.

---

# 2. Contraintes produit non négociables

## 2.1 InfraLens ne doit pas devenir un SaaS

Ne pas ajouter :

- authentification ;
- inscription ;
- comptes utilisateurs ;
- organisations ;
- équipes ;
- rôles ;
- permissions ;
- espace client ;
- abonnements ;
- paiement ;
- Stripe ;
- quotas par offre ;
- plans Free, Pro ou Enterprise ;
- historique synchronisé sur un compte ;
- monitoring permanent ;
- scans planifiés ;
- alertes par e-mail ;
- tableaux de bord persistants ;
- API payante ;
- logique commerciale envahissante.

Une fonctionnalité ne doit pas être ajoutée simplement parce qu’elle serait habituelle dans un SaaS.

## 2.2 Persistance minimale

Par défaut, les données d’analyse doivent rester éphémères.

L’historique local peut être conservé côté navigateur avec une limite claire.

Principes :

- aucune base de données nécessaire pour les utilisateurs ;
- aucune conservation serveur durable des URL analysées ;
- aucun profilage ;
- aucune collecte de contenu au-delà de ce qui est nécessaire à l’analyse ;
- aucune télémétrie intrusive ;
- aucune donnée d’analyse publiée automatiquement.

Une future fonctionnalité de rapport partageable ne doit être envisagée que si elle peut être réalisée de manière volontaire, temporaire et respectueuse de la vie privée. Elle n’est pas prioritaire dans le présent plan.

## 2.3 Analyse passive uniquement

InfraLens ne doit pas :

- exploiter de vulnérabilité ;
- brute-forcer ;
- contourner une authentification ;
- scanner des ports ;
- effectuer des injections ;
- exécuter du JavaScript tiers dans un navigateur automatisé sans nécessité absolue ;
- tester des identifiants ;
- envoyer un volume important de requêtes ;
- contourner un WAF ;
- lancer un crawler profond ;
- analyser des réseaux privés ;
- accéder aux services internes de l’hébergement.

L’objectif est de lire des signaux publics accessibles par des requêtes réseau ordinaires et limitées.

---

# 3. État de référence actuel

Au moment de la rédaction de ce document, le dépôt annonce notamment :

- Next.js avec App Router ;
- TypeScript strict ;
- Tailwind CSS ;
- composants shadcn/ui ;
- exécution serveur des contrôles ;
- 18 contrôles répartis en 6 catégories ;
- exécution parallèle ;
- timeout individuel ;
- cache DNS en mémoire ;
- scoring pondéré sur 100 ;
- export JSON ;
- historique local limité ;
- PWA ;
- documentation intégrée ;
- rate limiting en mémoire ;
- intégration facultative avec une API IP/ASN.

Cette liste est une indication et non une vérité absolue.

Avant toute modification, l’IA doit vérifier le code réel du dépôt et noter les différences éventuelles entre :

- le README ;
- l’interface ;
- la documentation ;
- le code ;
- le comportement déployé.

Le code réel prime toujours sur les descriptions historiques.

---

# 4. Vision cible

## 4.1 Promesse principale

Proposition recommandée en anglais :

> Inspect a website’s infrastructure in seconds.

Sous-titre recommandé :

> DNS, TLS, security headers, metadata, hosting and technical signals in one readable report.

Éléments de réassurance :

- No account ;
- No tracking ;
- Open source ;
- Passive checks only ;
- Server-side analysis.

## 4.2 Expérience idéale

Le parcours principal doit être extrêmement simple :

1. l’utilisateur arrive sur la page ;
2. il comprend immédiatement ce que fait InfraLens ;
3. il voit un aperçu réaliste des résultats ;
4. il saisit un domaine ou une URL ;
5. l’application normalise clairement la cible ;
6. l’analyse démarre avec une progression compréhensible ;
7. les résultats principaux apparaissent rapidement ;
8. l’utilisateur comprend le score et ses limites ;
9. il peut explorer chaque catégorie ;
10. il obtient des recommandations concrètes ;
11. il peut copier ou exporter le rapport ;
12. il peut lancer une nouvelle analyse sans créer de compte.

## 4.3 Principes de conception

- Priorité à la lisibilité plutôt qu’à la densité.
- Afficher les données importantes avant les détails bruts.
- Expliquer chaque signal sans faire peur inutilement.
- Distinguer clairement absence de donnée, avertissement et erreur technique.
- Ne jamais présenter une heuristique comme une certitude.
- Ne jamais présenter le score comme un certificat de sécurité.
- Toujours permettre à l’utilisateur de comprendre pourquoi un statut est attribué.
- Garder l’interface rapide même lorsque plusieurs contrôles échouent.
- Rendre les erreurs actionnables.

---

# 5. Architecture fonctionnelle cible

## 5.1 Pages recommandées

```text
/
├── /docs
├── /about ou section About dans la documentation
├── /privacy
├── /legal si nécessaire
└── routes techniques Next.js
```

Le produit peut rester une application essentiellement monopage.

Pages à ne pas créer sans raison forte :

- dashboard ;
- login ;
- signup ;
- pricing ;
- account ;
- billing ;
- teams ;
- projects ;
- scans planifiés ;
- notifications.

## 5.2 Sections de la page principale

Ordre recommandé :

1. navigation légère ;
2. hero avec champ d’analyse ;
3. aperçu concret d’un rapport ;
4. catégories analysées ;
5. explication du fonctionnement ;
6. limites et respect de la vie privée ;
7. appel à contribution open source ;
8. footer.

Après une analyse réussie, les résultats deviennent le contenu principal et la landing doit se réduire visuellement.

## 5.3 Navigation

Navigation minimale :

- InfraLens ;
- Documentation ;
- GitHub ;
- Randy Code.

Éviter les menus lourds et les navigations à plusieurs niveaux.

---

# 6. Refonte de la landing page

## 6.1 Hero

Remplacer toute identité principale basée sur `infralens.dev` par `InfraLens`.

Contenu recommandé :

### Eyebrow

> Open-source website inspection tool

### Titre

> Inspect a website’s infrastructure in seconds.

### Description

> Analyze DNS, TLS, security headers, metadata, hosting and technical signals in one readable report.

### Formulaire

- champ URL ;
- bouton `Analyze website` ;
- validation immédiate ;
- exemple de format accepté ;
- bouton désactivé uniquement lorsque nécessaire ;
- état de chargement explicite.

### Actions secondaires

- `View source on GitHub` ;
- `Read the documentation`.

### Réassurance

> No account · No tracking · Passive checks only

## 6.2 Exemples rapides

Ajouter des exemples cliquables :

- `example.com` ;
- `github.com` ;
- `vercel.com`.

Ils doivent uniquement remplir le champ ou lancer une analyse après une action volontaire claire.

Ne pas déclencher automatiquement des analyses au chargement.

## 6.3 Aperçu des résultats

Afficher avant analyse un exemple statique crédible :

- score global ;
- note ;
- répartition par catégorie ;
- deux résultats positifs ;
- un avertissement ;
- une recommandation.

L’aperçu doit être clairement indiqué comme démonstration.

Il ne doit pas être confondu avec une analyse réelle.

## 6.4 Valeur open source

Mettre en avant :

- licence MIT ;
- dépôt public ;
- architecture modulaire ;
- possibilité d’auto-hébergement ;
- contributions bienvenues.

Le lien GitHub ne doit pas être caché uniquement dans le footer.

## 6.5 Contenu à retirer ou réduire

Réduire les sections génériques qui répètent plusieurs fois :

- rapide ;
- lisible ;
- pour les développeurs ;
- pas de compte.

Préférer une démonstration visuelle et des preuves concrètes.

---

# 7. Formulaire et normalisation des URL

## 7.1 Formats acceptés

Accepter raisonnablement :

- `example.com` ;
- `www.example.com` ;
- `https://example.com` ;
- `http://example.com` ;
- une URL avec un chemin public.

La cible canonique doit être affichée clairement avant ou pendant l’analyse.

## 7.2 Normalisation

Créer une fonction centrale et testée responsable de :

- trim des espaces ;
- ajout éventuel de `https://` ;
- parsing via `URL` ;
- normalisation du hostname ;
- conversion des domaines internationaux si nécessaire ;
- suppression des fragments ;
- gestion maîtrisée des credentials ;
- refus des ports interdits ;
- refus des protocoles non autorisés ;
- production d’un objet cible typé.

Éviter que chaque contrôle reparsing lui-même la chaîne utilisateur.

## 7.3 Protocoles autorisés

Autoriser uniquement :

- `http:` ;
- `https:`.

Refuser notamment :

- `file:` ;
- `ftp:` ;
- `data:` ;
- `javascript:` ;
- `gopher:` ;
- `ws:` ;
- `wss:` ;
- protocoles personnalisés.

## 7.4 Credentials dans l’URL

Refuser les URL contenant :

- username ;
- password.

Exemple à refuser :

```text
https://user:password@example.com
```

## 7.5 Ports

Définir une stratégie explicite.

Approche recommandée pour le service public :

- autoriser 80 et 443 ;
- éventuellement autoriser quelques ports web publics non sensibles après analyse ;
- bloquer par défaut les ports inhabituels ;
- ne jamais permettre d’utiliser InfraLens comme proxy de scan de ports.

La politique choisie doit être testée et documentée.

---

# 8. Sécurité réseau et protection SSRF

Cette section est prioritaire.

InfraLens effectue des requêtes serveur vers une destination fournie par l’utilisateur. Une validation superficielle de la chaîne ne suffit pas.

## 8.1 Menaces à couvrir

- localhost ;
- loopback IPv4 et IPv6 ;
- plages privées ;
- link-local ;
- adresses de metadata cloud ;
- adresses réservées ;
- multicast ;
- domaines internes ;
- DNS rebinding ;
- redirections vers une IP interdite ;
- notation alternative d’adresse IP ;
- hostname se résolvant vers plusieurs IP dont une interdite ;
- IPv4 mappée en IPv6 ;
- abus de proxy ;
- réponses trop volumineuses ;
- connexions lentes ;
- redirections infinies ;
- décompression abusive ;
- protocole inattendu après redirection.

## 8.2 Plages à bloquer

La logique doit bloquer au minimum les catégories non publiques, pour IPv4 et IPv6 :

- loopback ;
- private use ;
- link-local ;
- unique local IPv6 ;
- multicast ;
- unspecified ;
- documentation ranges si elles ne sont pas nécessaires ;
- reserved ;
- carrier-grade NAT selon la politique retenue ;
- metadata endpoints connus.

Ne pas maintenir cette logique avec quelques préfixes de chaînes fragiles.

Utiliser une bibliothèque reconnue ou une implémentation robuste, centralisée et fortement testée.

## 8.3 Résolution DNS

Avant toute requête HTTP :

1. résoudre le hostname ;
2. récupérer toutes les adresses pertinentes ;
3. normaliser les représentations IPv4 et IPv6 ;
4. valider chaque adresse ;
5. refuser la cible si une adresse est interdite selon la politique ;
6. conserver les informations nécessaires pour limiter le risque de rebinding.

## 8.4 DNS rebinding

La protection doit considérer qu’un hostname peut changer d’adresse entre la validation et la connexion.

Solutions à étudier :

- résolution contrôlée ;
- connexion à l’adresse validée avec conservation du host/SNI ;
- dispatcher ou agent HTTP personnalisé ;
- validation de l’adresse réellement utilisée ;
- refus si la pile réseau ne permet pas d’assurer correctement la protection.

L’IA ne doit pas prétendre que le problème est résolu sans test démontrable.

## 8.5 Redirections

Ne pas laisser `fetch` suivre automatiquement toutes les redirections sans contrôle.

Approche recommandée :

- `redirect: "manual"` ;
- limite stricte, par exemple 5 redirections ;
- résolution de chaque `Location` ;
- nouvelle validation complète de chaque destination ;
- validation DNS de chaque hostname ;
- blocage de toute transition vers un protocole interdit ;
- collecte de la chaîne de redirection pour le rapport ;
- détection des boucles.

## 8.6 Limites réseau

Définir des constantes centrales :

- timeout connexion ;
- timeout total ;
- taille maximale des headers ;
- taille maximale du HTML lu ;
- nombre maximal de redirections ;
- nombre maximal de liens analysés ;
- concurrence maximale ;
- user-agent ;
- nombre de retries ;
- taille maximale après décompression.

Ne pas effectuer de retry agressif.

## 8.7 Types de contenu

Les contrôles HTML doivent :

- vérifier le `Content-Type` ;
- limiter la taille lue ;
- gérer proprement l’encodage ;
- éviter de parser des fichiers binaires ;
- interrompre la lecture lorsque la limite est atteinte.

## 8.8 User-Agent

Utiliser un user-agent explicite, par exemple :

```text
InfraLens/1.0 (+https://github.com/Randy-R-code/infralens)
```

La version et l’URL doivent être centralisées.

## 8.9 Journalisation de sécurité

Ne jamais loguer :

- des credentials ;
- une URL complète contenant des secrets ;
- des headers sensibles récupérés ;
- le contenu HTML complet ;
- des IP utilisateur en clair dans des logs persistants sans nécessité.

Les logs doivent être structurés et minimaux.

---

# 9. Orchestration des contrôles

## 9.1 Objectifs

L’orchestrateur doit :

- partager les données communes ;
- éviter les requêtes réseau en double ;
- isoler les erreurs ;
- respecter les limites de concurrence ;
- fournir des timings ;
- produire des résultats déterministes autant que possible ;
- permettre l’annulation ;
- rester testable.

## 9.2 Contexte partagé

Créer un contexte d’analyse typé contenant, selon les besoins :

```ts
interface AnalysisContext {
  target: NormalizedTarget;
  startedAt: Date;
  deadline: number;
  signal: AbortSignal;
  dns: ResolvedTarget;
  http: HttpSnapshot | null;
  html: HtmlSnapshot | null;
  redirectChain: RedirectHop[];
}
```

Le type exact doit suivre le code réel.

Le but est d’éviter que :

- le contrôle metadata télécharge la page ;
- le contrôle social télécharge la même page ;
- le contrôle accessibility la télécharge encore ;
- le contrôle stack répète la même requête.

## 9.3 Étapes recommandées

Pipeline indicatif :

1. validation de l’entrée ;
2. normalisation ;
3. résolution DNS sécurisée ;
4. collecte HTTP principale et redirections ;
5. lecture HTML limitée si applicable ;
6. lancement des contrôles dépendants ;
7. lancement des contrôles indépendants ;
8. scoring ;
9. génération des recommandations ;
10. sérialisation pour l’interface.

## 9.4 Concurrence

Ne pas utiliser `Promise.all()` sans limite si chaque module peut générer plusieurs requêtes.

Utiliser :

- un pool de concurrence ;
- des dépendances explicites ;
- des limites globales ;
- un `AbortController` partagé ;
- `Promise.allSettled()` lorsque l’isolation est souhaitée.

## 9.5 Délais

Distinguer :

- délai global d’analyse ;
- délai d’un contrôle ;
- délai d’une requête réseau ;
- délai DNS.

Une analyse dépassant le délai global doit terminer proprement avec des résultats partiels compréhensibles.

## 9.6 Résultats partiels

Un échec individuel ne doit pas invalider tout le rapport.

Chaque contrôle doit pouvoir retourner :

- `pass` ;
- `warning` ;
- `fail` ;
- `info` ;
- `unavailable` ;
- `error`.

Éviter d’utiliser `error` pour représenter une mauvaise configuration du site.

`error` doit signifier que le contrôle n’a pas pu s’exécuter correctement.

---

# 10. Modèle de données des résultats

## 10.1 Type de base recommandé

```ts
type CheckStatus =
  | "pass"
  | "warning"
  | "fail"
  | "info"
  | "unavailable"
  | "error";

interface CheckResult<TData = unknown> {
  id: string;
  category: CheckCategory;
  title: string;
  status: CheckStatus;
  summary: string;
  explanation?: string;
  data?: TData;
  evidence?: EvidenceItem[];
  recommendations?: Recommendation[];
  durationMs?: number;
  scored: boolean;
  scoreContribution?: number;
  limitations?: string[];
}
```

Le type final peut différer, mais les concepts doivent rester séparés.

## 10.2 Données et présentation

Ne pas stocker du JSX, des classes Tailwind ou du texte d’interface dans les modules réseau.

Les modules de contrôle doivent produire des données structurées.

La couche d’interface est responsable de :

- l’icône ;
- la couleur ;
- la mise en page ;
- le formatage ;
- la traduction future éventuelle.

## 10.3 Evidence

Chaque résultat important devrait pouvoir fournir une preuve structurée :

```ts
interface EvidenceItem {
  label: string;
  value: string | number | boolean | null;
  source?: "dns" | "header" | "html" | "tls" | "derived";
  sensitive?: boolean;
}
```

Cela améliore :

- la transparence ;
- l’export ;
- les tests ;
- la compréhension du score.

## 10.4 Version du schéma

Ajouter une version de schéma au rapport exporté :

```json
{
  "schemaVersion": "1.0",
  "generatedAt": "...",
  "target": {},
  "summary": {},
  "checks": []
}
```

Toute modification incompatible du format d’export doit modifier cette version.

---

# 11. Fiabilité et précision des contrôles

## 11.1 Principe général

Chaque contrôle doit documenter :

- ce qu’il mesure ;
- comment il le mesure ;
- les sources de faux positifs ;
- les sources de faux négatifs ;
- les limites ;
- son impact sur le score ;
- la recommandation associée.

## 11.2 Headers de sécurité

Vérifier au minimum :

- Content-Security-Policy ;
- Strict-Transport-Security ;
- X-Content-Type-Options ;
- Referrer-Policy ;
- Permissions-Policy ;
- protection contre l’encadrement via CSP `frame-ancestors` ou X-Frame-Options ;
- politiques COOP, COEP et CORP comme informations avancées, sans les exiger aveuglément.

Éviter les règles simplistes :

- un header présent n’est pas nécessairement correct ;
- `X-XSS-Protection` n’est pas une preuve moderne de sécurité ;
- une CSP très permissive ne doit pas recevoir le même statut qu’une CSP stricte ;
- HSTS sur HTTP sans HTTPS effectif ne suffit pas.

Analyser les valeurs lorsque cela est raisonnable.

## 11.3 HTTPS et TLS

Distinguer :

- disponibilité HTTPS ;
- redirection HTTP vers HTTPS ;
- certificat valide ;
- hostname couvert ;
- date d’expiration ;
- chaîne ;
- version TLS négociée ;
- erreurs réseau.

Ne pas qualifier automatiquement un site de dangereux parce qu’une information TLS avancée n’est pas récupérable dans l’environnement serverless.

## 11.4 Redirections

Afficher :

- URL initiale ;
- chaque hop ;
- statut HTTP ;
- durée approximative ;
- URL finale ;
- changement de protocole ;
- changement de hostname ;
- boucle éventuelle ;
- nombre total.

Avertir notamment sur :

- boucle ;
- trop de redirections ;
- downgrade HTTPS vers HTTP ;
- destination finale inaccessible.

## 11.5 security.txt

Vérifier les emplacements pertinents selon la norme prise en charge.

Distinguer :

- absent ;
- présent ;
- syntaxe partiellement valide ;
- expiré ;
- inaccessible ;
- redirection ;
- erreur technique.

Ne pas donner une pondération excessive à `security.txt` pour un petit site.

## 11.6 DNS records

Afficher les données de manière compacte :

- A ;
- AAAA ;
- CNAME ;
- MX ;
- TXT ;
- NS ;
- CAA si pertinent ;
- SOA si utile.

Ne pas marquer l’absence d’un type non obligatoire comme une erreur.

## 11.7 SPF, DKIM et DMARC

Points importants :

- l’absence de MX peut rendre les contrôles e-mail non applicables ;
- DKIM ne peut pas être découvert de manière exhaustive sans connaître le selector ;
- ne pas prétendre qu’un domaine n’a pas DKIM simplement parce qu’un selector arbitraire n’a pas répondu ;
- DMARC doit analyser la politique et non seulement la présence ;
- SPF doit détecter plusieurs records, les erreurs évidentes et les politiques trop permissives ;
- l’évaluation doit rester prudente.

Le contrôle DKIM doit probablement être classé comme information limitée, ou demander explicitement un selector dans un mode avancé non prioritaire.

## 11.8 DNSSEC

Vérifier ce qui est réellement observable depuis l’environnement d’exécution.

Documenter clairement si le contrôle utilise :

- résolution avec flag AD ;
- DS records ;
- DNSKEY ;
- une API externe ;
- une heuristique.

Ne pas afficher une certitude si la validation cryptographique complète n’est pas effectuée.

## 11.9 IP, ASN et hébergement

L’API externe doit être optionnelle.

Prévoir :

- timeout strict ;
- cache ;
- fallback ;
- statut `unavailable` ;
- aucune incidence négative majeure sur le score ;
- attribution du fournisseur ;
- respect des limites de l’API.

La détection d’hébergeur est indicative.

## 11.10 WAF et CDN

Présenter le résultat comme heuristique :

- `Detected` ;
- `Likely detected` ;
- `Not detected` ;
- `Unknown`.

Ne jamais conclure qu’un site n’utilise aucun WAF simplement parce qu’aucune signature connue n’est visible.

## 11.11 robots.txt

Vérifier :

- code HTTP ;
- type de contenu ;
- taille ;
- directives principales ;
- références de sitemap ;
- blocage global éventuel ;
- erreurs de syntaxe évidentes.

Ne pas présenter l’absence de `robots.txt` comme une vulnérabilité de sécurité.

## 11.12 Sitemap

Tester des emplacements raisonnables et les références de `robots.txt`.

Limiter :

- le nombre de sitemaps ;
- la taille téléchargée ;
- la profondeur des index ;
- le nombre d’URL lues.

Le contrôle doit rester un signal, pas devenir un crawler.

## 11.13 Liens

L’analyse des liens doit être légère.

Recommandation :

- extraire les liens du document initial ;
- normaliser ;
- compter internes, externes, ancres et liens spéciaux ;
- détecter les liens manifestement invalides ;
- ne pas vérifier chaque URL distante par défaut ;
- plafonner le nombre de liens traités.

Éviter une explosion de requêtes ou un mini-crawler involontaire.

## 11.14 Métadonnées

Vérifier :

- title ;
- meta description ;
- canonical ;
- viewport ;
- charset ;
- robots meta ;
- favicon ;
- manifest ;
- lang sur HTML dans la catégorie accessibilité.

Les recommandations de longueur doivent être indiquées comme bonnes pratiques, pas comme lois absolues.

## 11.15 Open Graph et social

Vérifier :

- og:title ;
- og:description ;
- og:image ;
- og:url ;
- og:type ;
- twitter:card ;
- twitter:title ;
- twitter:description ;
- twitter:image.

Ne pas pénaliser fortement un site qui n’a pas vocation à être partagé sur les réseaux sociaux.

## 11.16 Accessibilité

InfraLens ne doit pas prétendre réaliser un audit d’accessibilité complet.

Limiter le contrôle aux indices statiques observables :

- attribut `lang` ;
- présence d’un H1 ;
- hiérarchie grossière des titres ;
- images sans alt ;
- landmarks principaux ;
- labels de formulaires observables ;
- boutons sans nom accessible dans les cas simples.

Toujours afficher une limite explicite :

> This is a lightweight static check, not a complete accessibility audit.

## 11.17 Stack technique

Présenter les détections comme :

- confirmed ;
- likely ;
- possible.

Fonder les résultats sur plusieurs signaux :

- headers ;
- cookies non sensibles ;
- noms d’assets ;
- balises ;
- scripts ;
- markup ;
- DNS/CDN.

Éviter les affirmations certaines basées sur une seule chaîne fragile.

## 11.18 Server headers

Mettre en évidence :

- headers révélant inutilement des versions ;
- server ;
- x-powered-by ;
- via ;
- cache headers ;
- content encoding ;
- vary.

Ne pas considérer chaque header serveur comme une vulnérabilité critique.

## 11.19 Performance

InfraLens ne remplace pas Lighthouse, WebPageTest ou les Core Web Vitals terrain.

Le module doit parler de `performance signals`, pas d’un audit de performance complet.

Mesures raisonnables :

- DNS lookup approximatif ;
- connexion ;
- TTFB approximatif ;
- durée totale de réponse ;
- taille reçue limitée ;
- compression ;
- cache-control ;
- HTTP version si disponible.

Ne pas inventer des métriques navigateur impossibles à obtenir depuis une simple requête serveur.

## 11.20 Uptime

Renommer éventuellement le contrôle en :

- Reachability ;
- Availability snapshot.

Une seule requête ne mesure pas l’uptime.

Afficher explicitement :

> This is a point-in-time reachability check, not historical uptime monitoring.

---

# 12. Refonte du scoring

## 12.1 Problèmes à éviter

Le score ne doit pas :

- faire croire à une certification ;
- pénaliser un contrôle indisponible ;
- donner le même poids à tous les signaux ;
- récompenser la simple présence d’un header invalide ;
- sanctionner une fonctionnalité non applicable ;
- varier fortement à cause d’une API externe en panne ;
- cacher la méthode de calcul.

## 12.2 Modèle recommandé

Chaque contrôle doit définir :

- poids maximal ;
- statut ;
- applicabilité ;
- niveau de confiance ;
- contribution obtenue ;
- explication.

Statuts scorables possibles :

- pass : 100 % ;
- warning : valeur intermédiaire configurable ;
- fail : 0 % ;
- info : non scoré ;
- unavailable : exclu du dénominateur ;
- error : exclu du dénominateur et signalé.

## 12.3 Score normalisé

Le score final doit être normalisé sur les contrôles effectivement applicables et exécutés.

Exemple conceptuel :

```text
score = points obtenus / points disponibles applicables × 100
```

Le rapport doit afficher :

- score ;
- note ;
- nombre de contrôles scorés ;
- nombre de contrôles non disponibles ;
- catégorie la plus forte ;
- priorité principale.

## 12.4 Catégories

Les catégories actuelles peuvent être conservées si le code réel les justifie :

- HTTP & Security ;
- Network & DNS ;
- Infrastructure ;
- Website Structure ;
- Metadata & Stack ;
- Performance Signals.

Revoir les poids à partir de principes explicites.

Les contrôles purement informatifs ne doivent pas influencer le score.

## 12.5 Notes

Conserver éventuellement A à E pour la lisibilité, mais ajouter un libellé prudent :

- A — Strong configuration signals ;
- B — Good, with improvements available ;
- C — Mixed configuration ;
- D — Several important improvements ;
- E — Major public configuration issues detected.

Éviter `Excellent security` ou `Critical security` comme vérité générale.

## 12.6 Explication du score

La boîte `Why this score?` doit afficher :

- formule générale ;
- poids par catégorie ;
- contrôles exclus ;
- limites ;
- lien vers la documentation ;
- phrase indiquant que le score n’est pas une certification.

---

# 13. Recommandations

## 13.1 Qualités attendues

Une recommandation doit être :

- liée à une preuve ;
- spécifique ;
- courte en premier niveau ;
- détaillée à la demande ;
- adaptée au niveau de gravité ;
- accompagnée d’un exemple lorsqu’il est fiable ;
- non alarmiste.

## 13.2 Structure recommandée

```ts
interface Recommendation {
  id: string;
  priority: "high" | "medium" | "low";
  title: string;
  summary: string;
  rationale: string;
  steps?: string[];
  example?: string;
  references?: ReferenceLink[];
  appliesTo?: string[];
}
```

## 13.3 Priorisation

High :

- HTTPS absent ou cassé ;
- redirection vers HTTP ;
- certificat invalide ;
- CSP absente sur une application sensible, avec prudence ;
- absence de HSTS sur un site exclusivement HTTPS ;
- exposition technique particulièrement risquée et démontrable.

Medium :

- politique de sécurité incomplète ;
- DMARC faible pour un domaine envoyant des e-mails ;
- métadonnées importantes manquantes ;
- trop de redirections.

Low :

- enrichissements sociaux ;
- recommandations de structure ;
- optimisations mineures ;
- éléments informatifs.

## 13.4 Références

Préférer des sources primaires :

- RFC ;
- MDN ;
- W3C ;
- OWASP ;
- documentation officielle des standards concernés.

Centraliser les références afin d’éviter des liens morts dispersés.

---

# 14. Interface des résultats

## 14.1 En-tête du rapport

Afficher :

- favicon si disponible ;
- hostname ;
- URL finale ;
- date et heure ;
- durée ;
- score ;
- note ;
- statut global ;
- bouton nouvelle analyse ;
- export ;
- copie du résumé.

## 14.2 Résumé prioritaire

Avant toutes les cartes détaillées, afficher :

- 3 points positifs ;
- 3 priorités maximum ;
- contrôles indisponibles ;
- avertissement sur les limites.

## 14.3 Catégories

Pour chaque catégorie :

- score local ;
- nombre de pass/warning/fail ;
- barre ou indicateur accessible ;
- résumé ;
- accordéon ou section ;
- ordre stable.

## 14.4 Cartes de contrôle

Chaque carte doit montrer en premier niveau :

- titre ;
- statut ;
- résumé ;
- contribution au score si applicable ;
- durée facultative.

En second niveau :

- preuves ;
- valeurs brutes utiles ;
- explication ;
- limites ;
- recommandations ;
- références.

## 14.5 États visuels

Ne pas dépendre uniquement de la couleur.

Utiliser :

- texte ;
- icône ;
- badge ;
- aria-label ;
- contraste suffisant.

## 14.6 Filtres

Filtres utiles :

- All ;
- Needs attention ;
- Passed ;
- Informational ;
- Unavailable.

Permettre également une navigation par catégorie.

## 14.7 Copie et export

Ajouter :

- copier le hostname ;
- copier une valeur ;
- copier le résumé ;
- exporter le JSON ;
- éventuellement exporter un rapport Markdown côté client.

Le PDF n’est pas prioritaire et ne doit pas entraîner une dépendance lourde sans bénéfice clair.

## 14.8 Historique local

Conserver au maximum 10 analyses ou une limite équivalente.

Stocker seulement ce qui est utile :

- URL ;
- date ;
- score ;
- note ;
- résumé compact.

Prévoir :

- suppression individuelle ;
- effacement total ;
- information claire sur le stockage local ;
- gestion des données corrompues ;
- version du schéma local.

Ne pas conserver automatiquement tout le HTML ou toutes les preuves.

---

# 15. États de chargement et erreurs

## 15.1 Progression

Une simple roue peut être remplacée par une progression honnête :

- Validating target ;
- Resolving DNS ;
- Following redirects ;
- Inspecting response ;
- Running checks ;
- Calculating report.

Ne pas afficher de pourcentage fictif.

## 15.2 Annulation

Prévoir si possible un bouton d’annulation côté interface.

L’annulation doit propager un `AbortSignal` autant que possible.

## 15.3 Erreurs utilisateur

Messages spécifiques pour :

- URL invalide ;
- protocole interdit ;
- cible locale ou privée ;
- domaine inexistant ;
- timeout ;
- trop de redirections ;
- réponse trop volumineuse ;
- rate limit ;
- site inaccessible ;
- erreur serveur inattendue.

## 15.4 Erreurs de contrôle

Ne pas afficher une stack trace.

Une erreur interne doit fournir :

- un message utilisateur ;
- un identifiant d’erreur local si nécessaire ;
- une option de relance ;
- un lien GitHub Issues facultatif prérempli sans données sensibles.

---

# 16. Rate limiting et prévention des abus

## 16.1 Limites du stockage mémoire

Un rate limiter en mémoire est insuffisant sur un déploiement serverless multi-instance.

Il peut être conservé pour le développement local, mais pas considéré comme protection fiable en production.

## 16.2 Solution recommandée

Utiliser un stockage externe simple, par exemple Redis serverless, seulement pour le rate limiting.

Cela ne transforme pas InfraLens en SaaS.

Exigences :

- aucune base utilisateur ;
- clé dérivée de l’IP avec hachage ou minimisation appropriée ;
- TTL court ;
- aucune conservation durable ;
- fenêtre glissante ou token bucket ;
- limite configurable ;
- fallback maîtrisé ;
- headers de réponse adaptés ;
- message avec délai avant nouvel essai.

## 16.3 Politique

La limite actuelle d’une analyse toutes les 30 secondes par IP peut servir de point de départ.

Elle doit être rendue configurable :

```text
RATE_LIMIT_MAX
RATE_LIMIT_WINDOW_SECONDS
RATE_LIMIT_SALT
```

Évaluer également :

- limite globale ;
- limite par cible ;
- protection contre la concurrence excessive ;
- limite des API externes.

## 16.4 IP utilisateur

La récupération de l’IP doit tenir compte de l’environnement d’hébergement.

Ne pas faire confiance aveuglément à n’importe quel `X-Forwarded-For` dans un environnement non contrôlé.

Documenter la stratégie utilisée sur Vercel ou l’hébergeur retenu.

---

# 17. Cache

## 17.1 DNS

Le cache DNS en mémoire doit avoir :

- TTL ;
- taille maximale ;
- purge ;
- clés normalisées ;
- séparation par type ;
- gestion des erreurs temporaires ;
- tests.

## 17.2 Réponses HTTP

Ne pas mettre en cache aveuglément les pages analysées.

Un cache très court peut être envisagé pour éviter des analyses identiques simultanées, mais il doit respecter :

- URL normalisée ;
- confidentialité ;
- taille ;
- variation ;
- fraîcheur ;
- erreurs.

## 17.3 Déduplication en vol

Ajouter éventuellement une déduplication des analyses identiques en cours pour réduire la charge.

Ne pas ajouter une infrastructure complexe avant d’avoir mesuré le besoin.

---

# 18. PWA et fonctionnement hors ligne

## 18.1 Réalisme

L’interface peut être installable, mais une analyse réseau serveur ne fonctionne pas hors ligne.

La PWA ne doit pas donner l’impression que le scanner fonctionne sans connexion.

## 18.2 Comportement hors ligne

Hors ligne, permettre uniquement :

- ouverture de la coque de l’application ;
- accès à la documentation mise en cache si souhaité ;
- consultation de l’historique local compact ;
- message clair indiquant qu’une connexion est requise pour analyser.

## 18.3 Cache du service worker

Ne jamais mettre en cache :

- réponses d’analyse sensibles ;
- endpoints serveur de scan ;
- erreurs de rate limit ;
- contenus HTML de cibles externes.

Auditer soigneusement la stratégie PWA existante.

---

# 19. Documentation utilisateur

## 19.1 Structure recommandée

```text
Documentation
├── Overview
├── How analysis works
├── Scoring
├── Checks
│   ├── HTTP & Security
│   ├── Network & DNS
│   ├── Infrastructure
│   ├── Website Structure
│   ├── Metadata & Stack
│   └── Performance Signals
├── Privacy
├── Limitations
├── Self-hosting
├── Contributing
└── Changelog
```

## 19.2 Page de chaque contrôle

Pour chaque contrôle :

- objectif ;
- données utilisées ;
- méthode ;
- interprétation des statuts ;
- limites ;
- exemples ;
- recommandations ;
- poids ;
- références.

## 19.3 Limites

Créer une section visible, pas seulement une note en bas du README.

Inclure :

- snapshot ponctuel ;
- heuristiques ;
- localisation réseau ;
- environnement serverless ;
- absence de navigateur complet ;
- absence de scan intrusif ;
- absence de certification ;
- dépendance aux informations publiques disponibles.

## 19.4 Auto-hébergement

Documenter :

- prérequis ;
- variables d’environnement ;
- rate limiter facultatif ;
- API IP facultative ;
- build ;
- déploiement Vercel ;
- déploiement Node autonome si supporté ;
- limites de l’environnement ;
- configuration du user-agent.

---

# 20. README et dépôt open source

## 20.1 README cible

Le README doit contenir :

1. logo et proposition de valeur ;
2. capture réelle ;
3. lien démo ;
4. fonctionnalités ;
5. limites ;
6. architecture ;
7. installation ;
8. variables d’environnement ;
9. sécurité ;
10. tests ;
11. contribution ;
12. licence.

## 20.2 Badges

Utiliser seulement des badges utiles :

- CI ;
- licence ;
- version Node ;
- déploiement.

Éviter l’accumulation décorative.

## 20.3 Fichiers communautaires

Ajouter ou vérifier :

- `CONTRIBUTING.md` ;
- `SECURITY.md` ;
- `CODE_OF_CONDUCT.md` si souhaité ;
- templates d’issues ;
- template de pull request ;
- `CHANGELOG.md` ;
- licence MIT ;
- Dependabot ou Renovate ;
- politique de versions.

## 20.4 SECURITY.md

Expliquer :

- comment signaler une vulnérabilité ;
- ne pas publier immédiatement une faille exploitable ;
- versions supportées ;
- périmètre ;
- délai de traitement visé sans promesse irréaliste.

---

# 21. Architecture du code

## 21.1 Objectifs

- modules petits et cohérents ;
- logique réseau centralisée ;
- contrôles purs autant que possible ;
- dépendances explicites ;
- types stricts ;
- absence de duplication ;
- testabilité ;
- environnement configurable.

## 21.2 Organisation recommandée

Architecture indicative :

```text
src/
├── analysis/
│   ├── orchestrator/
│   ├── target/
│   ├── network/
│   ├── checks/
│   │   ├── http-security/
│   │   ├── dns/
│   │   ├── infrastructure/
│   │   ├── structure/
│   │   ├── metadata/
│   │   └── performance/
│   ├── scoring/
│   ├── recommendations/
│   ├── export/
│   └── types/
├── components/
│   ├── landing/
│   ├── analysis/
│   ├── results/
│   ├── docs/
│   └── ui/
├── config/
├── lib/
└── styles/
```

Ne pas réorganiser mécaniquement tout le dépôt si la structure actuelle est déjà claire.

La migration doit être justifiée par les dépendances et réalisée progressivement.

## 21.3 Client et serveur

Marquer clairement les frontières :

- parsing réseau : serveur ;
- DNS : serveur ;
- TLS : serveur ;
- stockage de l’historique : client ;
- affichage et filtres : client si nécessaire ;
- calcul du score : idéalement logique pure partageable, exécutée côté serveur ;
- export : sérialisation pure et téléchargement client.

## 21.4 Configuration

Centraliser :

- timeouts ;
- limites ;
- poids ;
- statuts ;
- catégories ;
- user-agent ;
- taille maximale ;
- nombre de redirections ;
- rate limit ;
- URLs externes ;
- version du schéma.

Valider les variables d’environnement au démarrage.

## 21.5 Erreurs typées

Créer des classes ou unions typées :

- InvalidTargetError ;
- BlockedTargetError ;
- DnsResolutionError ;
- RedirectLimitError ;
- ResponseTooLargeError ;
- AnalysisTimeoutError ;
- RateLimitError ;
- ExternalServiceError.

La traduction en message utilisateur doit être centralisée.

---

# 22. Tests

## 22.1 Stratégie

Ajouter plusieurs niveaux :

- tests unitaires ;
- tests d’intégration réseau simulée ;
- tests des server actions ou routes ;
- tests de composants ;
- tests end-to-end ;
- tests de sécurité SSRF ;
- tests du build.

## 22.2 Tests unitaires prioritaires

- normalisation URL ;
- protocoles ;
- credentials ;
- ports ;
- classification IP ;
- IPv4 ;
- IPv6 ;
- IPv4-mapped IPv6 ;
- redirections ;
- calcul du score ;
- exclusion des contrôles non disponibles ;
- mapping note ;
- parsing headers ;
- parsing SPF ;
- parsing DMARC ;
- parsing robots ;
- métadonnées ;
- recommandations ;
- export ;
- historique local.

## 22.3 Cas SSRF obligatoires

Tester le refus de :

- `localhost` ;
- `127.0.0.1` ;
- `127.1` si parser accepté ;
- `0.0.0.0` ;
- `::1` ;
- IP privée IPv4 ;
- link-local ;
- metadata cloud ;
- IPv6 unique local ;
- hostname résolvant vers privé ;
- hostname avec mélange public/privé ;
- redirection publique vers privé ;
- redirection vers protocole interdit ;
- URL avec credentials ;
- ports interdits.

Inclure des tests de notation alternative si la bibliothèque URL/IP peut les interpréter.

## 22.4 Réseau simulé

Ne pas dépendre exclusivement d’Internet dans la suite de tests.

Utiliser :

- mocks de DNS ;
- serveur HTTP local contrôlé dans l’environnement de test ;
- interception de fetch ;
- fixtures HTML ;
- certificats et erreurs simulés lorsque possible.

Les tests de sécurité ne doivent pas réellement atteindre des metadata endpoints.

## 22.5 Tests end-to-end

Scénarios :

- page initiale ;
- saisie d’un domaine ;
- validation ;
- analyse simulée ;
- résultats ;
- filtres ;
- accordéons ;
- export ;
- historique ;
- suppression ;
- rate limit ;
- erreur de domaine ;
- clavier ;
- mobile.

## 22.6 Couverture

Ne pas poursuivre un pourcentage arbitraire au détriment de la qualité.

Exiger une couverture forte sur :

- validation ;
- sécurité réseau ;
- scoring ;
- parsing ;
- erreurs.

---

# 23. Qualité, lint et CI

## 23.1 Commandes attendues

Le projet doit fournir des scripts explicites, par exemple :

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint .",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:e2e": "playwright test",
    "check": "pnpm lint && pnpm typecheck && pnpm test && pnpm build"
  }
}
```

Adapter aux outils réellement choisis.

## 23.2 CI

À chaque pull request :

- installation verrouillée ;
- lint ;
- typecheck ;
- tests ;
- build ;
- éventuellement e2e minimal.

## 23.3 Dépendances

- utiliser un lockfile ;
- vérifier les mises à jour ;
- limiter les dépendances lourdes ;
- préférer les API natives lorsque robustes ;
- auditer les bibliothèques réseau ;
- éviter une dépendance abandonnée pour une fonction de sécurité centrale.

---

# 24. Performance de l’application

## 24.1 Frontend

- limiter le JavaScript client ;
- utiliser les Server Components par défaut ;
- charger les composants interactifs à la demande ;
- éviter les animations lourdes ;
- optimiser les icônes ;
- éviter les librairies de graphiques si un rendu CSS suffit ;
- préserver la stabilité visuelle ;
- tester mobile.

## 24.2 Analyse serveur

- partager les snapshots ;
- limiter la concurrence ;
- limiter la taille ;
- utiliser les abort signals ;
- éviter les appels externes inutiles ;
- mesurer chaque contrôle ;
- identifier les contrôles lents ;
- ne pas bloquer le rapport complet pour une information secondaire.

## 24.3 Budget

Définir des objectifs indicatifs :

- interface interactive rapidement ;
- analyse courante en quelques secondes ;
- timeout global maîtrisé ;
- bundle client raisonnable ;
- aucune dépendance énorme pour une fonctionnalité mineure.

Les objectifs doivent être mesurés dans l’environnement réel.

---

# 25. Accessibilité de l’interface

Exigences :

- navigation clavier complète ;
- focus visible ;
- formulaire correctement labellisé ;
- erreurs associées au champ ;
- annonces de progression avec modération ;
- résultats structurés avec titres ;
- accordéons accessibles ;
- contraste suffisant ;
- statut non communiqué par couleur seule ;
- réduction des animations ;
- tableaux lisibles sur mobile ;
- liens descriptifs ;
- boutons avec noms accessibles ;
- zones dynamiques gérées sans déplacer brutalement le focus.

Prévoir des tests automatisés et une revue manuelle.

---

# 26. SEO et métadonnées d’InfraLens

## 26.1 Métadonnées

Titre recommandé :

> InfraLens — Open-source website infrastructure inspector

Description recommandée :

> Inspect DNS, TLS, security headers, metadata, hosting and other public technical signals in one readable report.

## 26.2 Canonical

Maintenir un canonical unique selon le domaine principal choisi.

Pendant une migration vers Randy Code :

- ne pas avoir deux versions indexables identiques ;
- utiliser des redirections permanentes ;
- mettre à jour canonical, sitemap et Open Graph ;
- conserver le dépôt séparé.

## 26.3 Données structurées

Évaluer :

- SoftwareApplication ;
- WebApplication ;
- WebSite.

Ne pas ajouter de données structurées incorrectes ou exagérées.

## 26.4 Documentation indexable

La documentation doit avoir :

- titres uniques ;
- URLs stables ;
- navigation interne ;
- métadonnées ;
- contenu serveur indexable.

---

# 27. Confidentialité

## 27.1 Principes

- aucun compte ;
- aucun tracking publicitaire ;
- aucune revente de données ;
- aucune conservation durable des analyses côté serveur ;
- historique local explicite ;
- logs minimisés ;
- services externes documentés.

## 27.2 Page Privacy

Expliquer simplement :

- quelles données sont envoyées ;
- pourquoi ;
- si l’IP utilisateur est utilisée pour le rate limiting ;
- combien de temps la clé dérivée est conservée ;
- quels services tiers sont contactés ;
- ce qui est stocké localement ;
- comment supprimer l’historique ;
- que les sites analysés peuvent voir les requêtes d’InfraLens dans leurs logs.

## 27.3 Analyse de domaines tiers

Ajouter une note claire :

- l’analyse porte uniquement sur des informations publiques ;
- elle génère quelques requêtes réseau ordinaires ;
- elle n’est pas intrusive ;
- elle ne garantit pas l’exactitude exhaustive.

---

# 28. Intégration avec Randy Code

## 28.1 Marque

Afficher :

> InfraLens

Puis discrètement :

> An open-source tool by Randy Code

## 28.2 Liens

Footer ou navigation :

- Randy Code ;
- GitHub ;
- documentation ;
- licence ;
- privacy.

## 28.3 Déploiement

Conserver le dépôt et le déploiement indépendants.

Options futures :

1. `infralens.dev` ;
2. `infralens.randy-code.dev` ;
3. exposition via rewrite sous `randy-code.dev/tools/infralens`.

Le présent projet doit éviter toute hypothèse rigide sur le domaine.

Utiliser une variable centrale :

```text
NEXT_PUBLIC_APP_URL
```

et une configuration de marque réutilisable.

## 28.4 Migration éventuelle

Lors d’une migration de domaine :

- redirection 301 ;
- canonical ;
- sitemap ;
- robots ;
- Open Graph ;
- manifest PWA ;
- liens README ;
- GitHub About ;
- badges ;
- documentation ;
- variables d’environnement ;
- tests de chemins d’assets.

---

# 29. Fonctionnalités recommandées sans dérive SaaS

## 29.1 Prioritaires

- aperçu de rapport sur la landing ;
- résumé des priorités ;
- meilleure explication du score ;
- filtres de résultats ;
- copie du résumé ;
- export JSON versionné ;
- export Markdown côté client ;
- historique local amélioré ;
- exemples rapides ;
- annulation ;
- documentation par contrôle ;
- meilleure sécurité SSRF ;
- rate limiting fiable ;
- tests complets.

## 29.2 Utiles plus tard

- comparaison locale de deux exports JSON ;
- mode `before / after` entièrement côté client ;
- import d’un ancien rapport JSON ;
- partage manuel d’un rapport Markdown ;
- CLI open source utilisant le même moteur ;
- Dockerfile ;
- image auto-hébergeable ;
- API locale pour les installations self-hosted.

## 29.3 À ne pas prioriser

- rapport PDF ;
- scans récurrents ;
- alertes ;
- comptes ;
- persistance serveur ;
- collaboration ;
- commentaires ;
- dashboard ;
- intégration Slack ;
- webhook ;
- facturation ;
- IA générative pour reformuler les résultats.

L’IA n’est pas nécessaire pour expliquer des règles techniques déterministes.

---

# 30. Comparaison locale de rapports

Cette fonctionnalité est compatible avec un outil non-SaaS si elle reste locale.

## 30.1 Principe

L’utilisateur peut :

- importer deux exports JSON ;
- ou comparer l’analyse actuelle à une entrée d’historique suffisamment détaillée ;
- voir les changements ;
- exporter un résumé Markdown.

## 30.2 Données

Afficher :

- score avant/après ;
- contrôles améliorés ;
- régressions ;
- nouvelles informations ;
- changements DNS ;
- changements headers ;
- changements de stack détectée.

## 30.3 Contraintes

- aucune base de données ;
- traitement navigateur ;
- validation stricte du schéma importé ;
- compatibilité de version ;
- aucune exécution de contenu importé ;
- taille maximale ;
- données échappées.

Cette fonctionnalité ne doit être réalisée qu’après fiabilisation du schéma d’export.

---

# 31. Observabilité technique minimale

## 31.1 Besoin

Le service doit pouvoir diagnostiquer :

- taux d’erreur ;
- contrôles lents ;
- timeouts ;
- erreurs d’API externe ;
- déclenchements du rate limit ;
- erreurs SSRF bloquées.

## 31.2 Contraintes de confidentialité

Ne pas enregistrer durablement :

- URL complète si elle contient un chemin sensible ;
- query strings ;
- contenu ;
- headers sensibles ;
- IP en clair.

Préférer :

- hostname tronqué ou haché si utile ;
- catégorie d’erreur ;
- durée ;
- identifiant de contrôle ;
- environnement ;
- version.

## 31.3 Analytics frontend

Aucune analytics n’est obligatoire.

Si une mesure d’usage est ajoutée, elle doit être :

- minimale ;
- sans cookies si possible ;
- transparente ;
- cohérente avec la promesse `No tracking`.

La solution la plus cohérente reste de ne pas ajouter d’analytics utilisateur tant qu’elles ne sont pas nécessaires.

---

# 32. Phases de réalisation

## Phase 0 — Audit complet et baseline

### Objectif

Comprendre l’état réel avant toute refonte.

### Tâches

- lire le README, CHANGELOG et documentation ;
- inventorier les routes ;
- inventorier les composants ;
- inventorier les 18 contrôles réels ;
- inventorier les appels réseau ;
- identifier les téléchargements dupliqués ;
- lire la normalisation URL ;
- auditer le rate limiter ;
- auditer les protections SSRF ;
- auditer le scoring ;
- auditer l’export ;
- auditer l’historique ;
- auditer la PWA ;
- auditer les variables d’environnement ;
- lancer lint, typecheck, tests et build ;
- noter les erreurs ;
- mesurer une analyse locale ;
- comparer le comportement avec le README.

### Livrables

Créer :

```text
docs/audit/BASELINE.md
```

Il doit contenir :

- architecture actuelle ;
- commandes exécutées ;
- résultats ;
- risques ;
- écarts documentation/code ;
- dette technique ;
- priorités ;
- captures ou mesures si utiles.

### Critères de validation

- aucune modification fonctionnelle majeure ;
- audit reproductible ;
- risques SSRF explicitement évalués ;
- liste exacte des contrôles ;
- baseline de build connue.

---

## Phase 1 — Fondations de qualité

### Objectif

Rendre le projet vérifiable avant les changements importants.

### Tâches

- corriger lint et typecheck ;
- ajouter ou fiabiliser le framework de tests ;
- créer scripts standards ;
- ajouter CI ;
- ajouter validation des variables d’environnement ;
- centraliser constantes principales ;
- ajouter format de logs minimal ;
- documenter la commande `check`.

### Livrables

- scripts package ;
- workflow CI ;
- premiers tests ;
- documentation développeur mise à jour.

### Critères de validation

```text
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

Toutes les commandes passent.

---

## Phase 2 — Sécurisation de la cible et SSRF

### Objectif

Sécuriser toute entrée avant amélioration produit.

### Tâches

- créer le modèle `NormalizedTarget` ;
- centraliser le parsing ;
- bloquer protocoles ;
- bloquer credentials ;
- définir politique de ports ;
- classifier IP ;
- sécuriser DNS ;
- gérer toutes les adresses résolues ;
- contrôler les redirections manuellement ;
- limiter leur nombre ;
- ajouter timeouts et tailles ;
- revoir le client HTTP ;
- ajouter tests SSRF ;
- documenter les limites résiduelles.

### Critères de validation

- tous les cas SSRF obligatoires sont testés ;
- aucune redirection ne contourne la validation ;
- aucun protocole non HTTP n’est accepté ;
- les limites réseau sont centralisées ;
- les erreurs sont lisibles ;
- la documentation sécurité est mise à jour.

---

## Phase 3 — Refactor du pipeline d’analyse

### Objectif

Éliminer les requêtes dupliquées et fiabiliser l’orchestration.

### Tâches

- créer le contexte partagé ;
- séparer collecte et interprétation ;
- partager DNS, réponse HTTP et HTML ;
- gérer l’annulation ;
- limiter la concurrence ;
- mesurer les durées ;
- gérer les résultats partiels ;
- créer des erreurs typées ;
- réduire les dépendances entre UI et réseau.

### Critères de validation

- une page HTML principale n’est téléchargée qu’une fois sauf justification ;
- un échec secondaire ne casse pas le rapport ;
- timeout global ;
- timings disponibles ;
- tests d’intégration.

---

## Phase 4 — Modèle de résultat et export

### Objectif

Stabiliser le contrat de données.

### Tâches

- revoir `CheckStatus` ;
- distinguer fail/error/unavailable/info ;
- ajouter evidence ;
- ajouter limitations ;
- versionner le schéma ;
- valider l’export ;
- nettoyer les données sensibles ;
- ajouter import de validation uniquement pour tests ou futur comparateur ;
- documenter JSON.

### Critères de validation

- schéma documenté ;
- export déterministe ;
- snapshot tests ;
- aucune donnée inutilement sensible ;
- compatibilité gérée.

---

## Phase 5 — Révision du scoring

### Objectif

Rendre le score honnête et explicable.

### Tâches

- classer contrôles scorés/non scorés ;
- gérer applicabilité ;
- exclure indisponibles ;
- revoir poids ;
- revoir notes ;
- ajouter résumé de calcul ;
- ajouter tests exhaustifs ;
- documenter chaque poids.

### Critères de validation

- 0 division impossible ;
- API externe indisponible sans pénalité injuste ;
- catégories normalisées ;
- score reproductible ;
- explication visible ;
- aucun terme de certification.

---

## Phase 6 — Fiabilisation des contrôles HTTP et sécurité

### Objectif

Améliorer headers, HTTPS, TLS, redirects et security.txt.

### Tâches

- analyser les valeurs et non la seule présence ;
- revoir CSP ;
- revoir HSTS ;
- revoir framing ;
- revoir TLS ;
- enrichir redirect chain ;
- revoir security.txt ;
- ajouter fixtures ;
- ajouter recommandations spécifiques ;
- documenter limites.

### Critères de validation

- tests par contrôle ;
- pas de faux message critique évident ;
- données et interprétation séparées ;
- références primaires.

---

## Phase 7 — Fiabilisation DNS et infrastructure

### Objectif

Améliorer records, e-mail security, DNSSEC, hébergement et WAF/CDN.

### Tâches

- revoir DNS records ;
- ajouter CAA si pertinent ;
- revoir SPF ;
- revoir DMARC ;
- corriger l’interprétation DKIM ;
- documenter DNSSEC ;
- fiabiliser API IP ;
- rendre WAF/CDN probabiliste ;
- mettre en cache raisonnablement ;
- tester.

### Critères de validation

- pas de conclusion DKIM non fondée ;
- contrôles non applicables gérés ;
- API externe optionnelle ;
- wording probabiliste.

---

## Phase 8 — Fiabilisation structure, metadata et accessibilité

### Objectif

Améliorer HTML, robots, sitemap, liens, métadonnées et indices d’accessibilité.

### Tâches

- limite HTML ;
- content-type ;
- parse unique ;
- robots ;
- sitemap limité ;
- liens non crawlés massivement ;
- metadata ;
- social ;
- accessibility hints ;
- stack confidence ;
- server headers ;
- tests fixtures.

### Critères de validation

- aucun crawler profond ;
- limites explicites ;
- accessibilité qualifiée de lightweight ;
- heuristiques de stack graduées.

---

## Phase 9 — Performance signals et disponibilité

### Objectif

Reformuler et fiabiliser les métriques réseau.

### Tâches

- renommer uptime en reachability snapshot ;
- définir métriques réellement mesurées ;
- éviter les promesses Core Web Vitals ;
- collecter compression/cache ;
- afficher contexte réseau ;
- ajouter timings ;
- tests simulés.

### Critères de validation

- aucun langage de monitoring ;
- aucune métrique inventée ;
- limites visibles ;
- impact scoring raisonnable.

---

## Phase 10 — Refonte de l’interface des résultats

### Objectif

Rendre le rapport immédiatement utile.

### Tâches

- nouveau header de rapport ;
- résumé points positifs/priorités ;
- filtres ;
- catégories ;
- cartes progressives ;
- evidence ;
- recommandations ;
- copie ;
- export ;
- responsive ;
- accessibilité ;
- skeleton/progression ;
- annulation.

### Critères de validation

- priorités visibles sans ouvrir 18 cartes ;
- clavier fonctionnel ;
- statut non dépendant de la couleur ;
- mobile lisible ;
- export accessible.

---

## Phase 11 — Refonte de la landing et de la marque

### Objectif

Présenter correctement InfraLens avant même la première analyse.

### Tâches

- remplacer `infralens.dev` par InfraLens dans l’identité ;
- réécrire hero ;
- ajouter aperçu ;
- ajouter exemples ;
- mettre GitHub en avant ;
- clarifier passive checks ;
- améliorer sections ;
- mettre à jour metadata ;
- mettre à jour assets et Open Graph ;
- ajouter lien Randy Code.

### Critères de validation

- proposition comprise immédiatement ;
- démonstration visible ;
- domaine non confondu avec la marque ;
- aucune promesse SaaS ;
- liens fonctionnels.

---

## Phase 12 — Historique local, PWA et confidentialité

### Objectif

Rendre les fonctionnalités locales sûres et compréhensibles.

### Tâches

- versionner historique ;
- limiter données ;
- suppression ;
- clear all ;
- fallback données corrompues ;
- auditer service worker ;
- exclure analyses du cache ;
- écran offline ;
- page privacy ;
- logs minimisés.

### Critères de validation

- aucune analyse serveur mise en cache par la PWA ;
- historique supprimable ;
- offline honnête ;
- privacy cohérente avec No tracking.

---

## Phase 13 — Rate limiting production

### Objectif

Remplacer la protection mémoire fragile.

### Tâches

- abstraction rate limiter ;
- implémentation locale mémoire ;
- implémentation production externe ;
- clé minimisée ;
- TTL ;
- configuration ;
- messages ;
- tests ;
- documentation déploiement.

### Critères de validation

- fonctionne multi-instance ;
- ne conserve pas durablement les IP ;
- fallback défini ;
- headers et délai fournis ;
- pas de compte ou base utilisateur.

---

## Phase 14 — Documentation et open source

### Objectif

Rendre le projet compréhensible et contributable.

### Tâches

- README ;
- captures ;
- docs par contrôle ;
- scoring ;
- limitations ;
- privacy ;
- self-hosting ;
- contributing ;
- security policy ;
- templates GitHub ;
- changelog ;
- architecture diagram ;
- mise à jour GitHub About.

### Critères de validation

- installation reproductible ;
- documentation cohérente avec code ;
- chaque contrôle documenté ;
- contribution claire ;
- sécurité signalable en privé.

---

## Phase 15 — Tests E2E, performance et release

### Objectif

Préparer une version stable.

### Tâches

- compléter E2E ;
- tests mobile ;
- accessibilité ;
- audit bundle ;
- mesure analyse ;
- revue de dépendances ;
- revue SSRF finale ;
- revue privacy ;
- version ;
- changelog ;
- release GitHub ;
- déploiement preview ;
- smoke tests production.

### Critères de validation

- CI verte ;
- tests sécurité verts ;
- build reproductible ;
- documentation finale ;
- aucune régression majeure ;
- rollback possible.

---

## Phase 16 — Comparateur local facultatif

### Objectif

Comparer deux rapports sans backend ni compte.

### Prérequis

- schéma export stable ;
- import sécurisé ;
- UI résultats stable.

### Tâches

- import de deux JSON ;
- validation ;
- diff ;
- score ;
- améliorations/régressions ;
- export Markdown ;
- tests ;
- aucune persistance serveur.

### Critères de validation

- traitement 100 % local ;
- fichier malformé refusé ;
- aucune injection ;
- versions incompatibles expliquées.

---

# 33. Backlog détaillé par priorité

## P0 — Sécurité et exactitude

- protection SSRF complète ;
- redirections validées ;
- limites réseau ;
- parsing URL central ;
- ports ;
- tests IP ;
- rate limiting production ;
- distinction error/fail ;
- correction des contrôles trompeurs ;
- score excluant indisponibles ;
- suppression de toute affirmation non démontrée.

## P1 — Expérience principale

- identité InfraLens ;
- hero ;
- aperçu ;
- progression ;
- résumé prioritaire ;
- filtres ;
- résultats progressifs ;
- recommandations ;
- export ;
- historique local maîtrisé ;
- mobile ;
- accessibilité.

## P2 — Qualité du projet

- tests ;
- CI ;
- documentation ;
- SECURITY ;
- CONTRIBUTING ;
- fixtures ;
- logs ;
- cache ;
- PWA ;
- configuration ;
- dépendances.

## P3 — Améliorations facultatives

- export Markdown ;
- comparaison locale ;
- CLI ;
- Docker ;
- auto-hébergement avancé ;
- import de rapport.

---

# 34. Règles de travail imposées à l’IA

## 34.1 Avant toute phase

L’IA doit :

1. lire ce document ;
2. lire les fichiers concernés ;
3. vérifier la branche ;
4. exécuter la baseline utile ;
5. résumer le périmètre ;
6. identifier les risques ;
7. ne modifier que la phase demandée.

## 34.2 Pendant la phase

L’IA doit :

- préserver le comportement non concerné ;
- créer des commits logiques si elle gère Git ;
- éviter les refactors massifs non nécessaires ;
- ajouter des tests avec les changements ;
- documenter les décisions non évidentes ;
- ne pas masquer une erreur avec un `any` ;
- ne pas désactiver ESLint ;
- ne pas supprimer un test pour faire passer la CI ;
- ne pas ajouter de dépendance sans justification ;
- ne jamais introduire de compte ou facturation ;
- ne jamais contourner une protection SSRF pour faire fonctionner un test.

## 34.3 Après la phase

L’IA doit fournir :

- résumé des changements ;
- fichiers modifiés ;
- décisions ;
- commandes exécutées ;
- résultats ;
- tests ajoutés ;
- limites restantes ;
- points nécessitant une revue humaine ;
- statut des critères de validation.

## 34.4 Interdictions

L’IA ne doit pas :

- réécrire tout le projet sans nécessité ;
- modifier plusieurs phases silencieusement ;
- introduire un backend utilisateur ;
- inventer une conformité ;
- déclarer une sécurité absolue ;
- ajouter un scanner intrusif ;
- ajouter du tracking en contradiction avec le produit ;
- stocker les analyses sur un serveur par défaut ;
- ajouter une IA générative sans besoin démontré ;
- ajouter des animations au détriment de l’accessibilité ;
- exposer des détails internes dans les erreurs.

---

# 35. Définition globale de terminé

Le projet est considéré comme significativement amélioré lorsque :

## Produit

- la marque affichée est InfraLens ;
- la promesse est comprise rapidement ;
- un aperçu montre la valeur ;
- l’analyse ne nécessite aucun compte ;
- les résultats sont synthétiques puis détaillés ;
- le score est expliqué ;
- les recommandations sont concrètes ;
- les limites sont visibles.

## Sécurité

- validation URL centralisée ;
- SSRF testée ;
- redirections contrôlées ;
- réseaux privés bloqués ;
- timeouts et tailles ;
- rate limiting fiable ;
- logs minimisés ;
- aucune fonctionnalité intrusive.

## Technique

- TypeScript strict ;
- lint ;
- tests ;
- build ;
- CI ;
- modules testables ;
- snapshots partagés ;
- erreurs typées ;
- configuration centralisée ;
- export versionné.

## UX

- mobile ;
- clavier ;
- contrastes ;
- progression honnête ;
- annulation ;
- filtres ;
- export ;
- historique local contrôlable ;
- états d’erreur clairs.

## Open source

- README actuel ;
- documentation complète ;
- contribution ;
- politique de sécurité ;
- licence ;
- changelog ;
- installation reproductible ;
- limites transparentes.

## Non-SaaS

- aucune authentification ;
- aucun abonnement ;
- aucune facturation ;
- aucune organisation ;
- aucune persistance serveur utilisateur ;
- aucun monitoring récurrent ;
- aucune alerte ;
- aucun dashboard personnel.

---

# 36. Prompt de démarrage recommandé

```text
Lis intégralement INFRALENS_MASTER_PLAN.md et considère-le comme la source de vérité pour l’évolution d’InfraLens.

Commence uniquement par la Phase 0 — Audit complet et baseline.

Ne modifie pas encore l’interface, le scoring, les contrôles ou l’architecture. Analyse le code réellement présent, exécute les commandes disponibles et crée docs/audit/BASELINE.md avec les livrables demandés.

Accorde une attention particulière à :
- la normalisation des URL ;
- la protection SSRF ;
- le suivi des redirections ;
- les requêtes réseau dupliquées ;
- le rate limiting en environnement serverless ;
- la distinction entre erreur de contrôle et mauvais résultat ;
- la fiabilité du scoring ;
- les divergences entre README, documentation et code.

À la fin, fournis :
1. les commandes exécutées et leurs résultats ;
2. les fichiers examinés ;
3. les risques classés par priorité ;
4. les écarts constatés ;
5. le statut des critères de validation de la Phase 0.
```

---

# 37. Prompt de réalisation d’une phase

```text
Lis INFRALENS_MASTER_PLAN.md.

Réalise uniquement la Phase [NUMÉRO ET NOM].

Avant de coder :
- lis le rapport docs/audit/BASELINE.md ;
- vérifie l’état actuel des fichiers concernés ;
- résume le périmètre et les risques.

Pendant la réalisation :
- respecte les contraintes non-SaaS ;
- ajoute ou adapte les tests ;
- évite les changements sans rapport ;
- conserve TypeScript strict ;
- documente les décisions importantes.

Après la réalisation :
- exécute lint, typecheck, tests et build ;
- fournis les résultats exacts ;
- liste les fichiers modifiés ;
- vérifie chaque critère de validation ;
- indique clairement les limites restantes.
```

---

# 38. Prompt de revue de sécurité

```text
Effectue une revue de sécurité ciblée du moteur d’analyse InfraLens.

Concentre-toi uniquement sur :
- SSRF ;
- parsing et normalisation des URL ;
- classification IPv4 et IPv6 ;
- DNS rebinding ;
- redirections ;
- protocoles ;
- ports ;
- timeouts ;
- tailles maximales ;
- décompression ;
- concurrence ;
- rate limiting ;
- logs ;
- erreurs ;
- services externes.

Ne te contente pas de lire les noms des fonctions. Trace le chemin complet depuis l’entrée utilisateur jusqu’à chaque requête réseau.

Pour chaque risque, indique :
- fichier et fonction ;
- scénario ;
- impact ;
- exploitabilité ;
- protection actuelle ;
- correction recommandée ;
- test à ajouter.

Ne modifie pas le code durant cette revue sauf demande explicite.
```

---

# 39. Prompt de revue d’un contrôle

```text
Analyse le contrôle InfraLens suivant : [NOM DU CONTRÔLE].

Vérifie :
- ce qu’il prétend mesurer ;
- les données réellement utilisées ;
- les requêtes effectuées ;
- les timeouts ;
- les faux positifs ;
- les faux négatifs ;
- l’applicabilité ;
- le statut renvoyé ;
- le poids dans le score ;
- les recommandations ;
- les références ;
- les tests.

Compare le code, la documentation et l’interface.

Propose une correction qui reste légère, passive, compatible serverless et non-SaaS.
```

---

# 40. Checklist finale de pull request

## Périmètre

- [ ] La PR correspond à une seule phase ou un sous-ensemble clairement nommé.
- [ ] Aucun changement SaaS n’a été introduit.
- [ ] Aucun scan intrusif n’a été ajouté.
- [ ] Les changements hors périmètre sont expliqués.

## Sécurité

- [ ] Toutes les nouvelles URL passent par le validateur central.
- [ ] Toutes les redirections sont validées.
- [ ] Les timeouts sont présents.
- [ ] Les tailles sont limitées.
- [ ] Les erreurs ne révèlent pas de secret.
- [ ] Les tests SSRF concernés sont présents.

## Exactitude

- [ ] Les heuristiques sont qualifiées.
- [ ] Les contrôles non applicables ne sont pas pénalisés.
- [ ] Les erreurs techniques ne sont pas présentées comme des échecs du site.
- [ ] Les recommandations correspondent aux preuves.
- [ ] La documentation a été mise à jour.

## Qualité

- [ ] Lint passe.
- [ ] Typecheck passe.
- [ ] Tests passent.
- [ ] Build passe.
- [ ] Aucune désactivation globale de règle.
- [ ] Aucune utilisation injustifiée de `any`.

## UX

- [ ] Mobile vérifié.
- [ ] Clavier vérifié.
- [ ] Contrastes vérifiés.
- [ ] États de chargement et d’erreur vérifiés.
- [ ] Aucun statut communiqué seulement par couleur.

## Confidentialité

- [ ] Aucune nouvelle persistance serveur utilisateur.
- [ ] Aucun tracking implicite.
- [ ] Logs minimisés.
- [ ] Historique local documenté.

---

# 41. Résumé de la direction

InfraLens doit devenir un excellent outil open source ponctuel, pas une plateforme.

La priorité n’est pas d’ajouter toujours plus de contrôles.

La priorité est de rendre ceux qui existent :

- sûrs ;
- fiables ;
- honnêtes ;
- rapides ;
- compréhensibles ;
- bien testés ;
- bien documentés.

La direction finale est :

> **InfraLens — un inspecteur d’infrastructure web open source, rapide, passif et lisible, intégré à l’écosystème Randy Code sans comptes, abonnements ni monitoring.**
