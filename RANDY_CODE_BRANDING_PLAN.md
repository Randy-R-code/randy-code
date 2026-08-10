# RANDY CODE — BRANDING & VISUAL SYSTEM PLAN

> Document de référence à lire avant tout refactor visuel du portfolio.
>
> Ce fichier complète `RANDY_CODE_MASTER_PLAN.md`.
> En cas de conflit :
>
> 1. la structure, le contenu et les objectifs produit restent définis par le master plan ;
> 2. le présent document fait autorité pour l’identité visuelle, la palette, le background, le logo, les tokens, les composants décoratifs et les règles d’intégration d’InfraLens.

---

## 0. Objectif

Construire une identité cohérente, sobre, moderne et immédiatement reconnaissable pour **Randy Code**, sans perdre l’idée d’exploration déjà présente dans le portfolio.

Le résultat ne doit pas ressembler à :

- un portfolio générique bleu/violet ;
- une interface cyberpunk ;
- un tableau de bord SaaS ;
- un décor de jeu vidéo trop chargé ;
- une collection de pages ayant chacune leur propre identité.

Le résultat doit évoquer :

- la construction ;
- les connexions ;
- les systèmes ;
- les chemins ;
- la précision ;
- l’exploration technique ;
- un développeur qui construit des produits réels.

---

## 1. Décision de marque

### Nom principal

Utiliser partout :

**Randy Code**

Le domaine reste :

`randy-code.dev`

Le terme historique **R-code** peut continuer à exister :

- dans le nom GitHub ;
- dans certains crédits ;
- comme référence historique ;
- éventuellement dans une signature secondaire.

Il ne doit plus être le nom principal affiché dans l’interface.

### Architecture de marque

Randy Code devient la marque mère.

Sous cette marque vivent :

- Liflow, produit autonome avec sa propre identité ;
- InfraLens, outil open source intégré à Randy Code ;
- les futurs outils, expérimentations et études de cas.

Liflow n’a pas besoin d’être graphiquement absorbé par Randy Code. Son identité actuelle est cohérente avec son usage familial et émotionnel. Il sert de preuve qu’un produit peut avoir une personnalité propre tout en étant présenté dans l’écosystème Randy Code.

InfraLens, en revanche, doit être clairement signé :

> InfraLens — an open-source tool by Randy Code

ou en français :

> InfraLens — un outil open source par Randy Code

---

## 2. Principes non négociables

1. Un seul univers visuel principal sur toutes les pages.
2. Le background reste cohérent d’une page à l’autre.
3. Les couleurs de page actuelles ne doivent plus définir des univers indépendants.
4. La palette repose principalement sur le bleu, le vert et leurs variantes.
5. Le rouge, l’orange et le jaune restent réservés aux états fonctionnels.
6. Le décor ne doit jamais nuire à la lisibilité.
7. Les animations décoratives restent lentes, rares et désactivables.
8. Tous les éléments importants doivent fonctionner sans animation.
9. Le logo doit rester lisible à 16 px.
10. Le système visuel doit être implémenté avec des tokens, pas avec des couleurs dispersées dans les composants.
11. La page d’accueil peut être la plus expressive, mais elle doit rester visuellement compatible avec les autres pages.
12. La carte interactive reste un élément distinctif, pas une excuse pour multiplier les couleurs.
13. Les pages Projets, Outils, Articles, À propos et Contact doivent sembler appartenir au même produit.
14. L’identité doit rester crédible dans un contexte professionnel, freelance, recrutement et open source.

---

## 3. Direction artistique

### Résumé

**Carte technique sobre sur fond sombre, enrichie de lignes, nœuds, grilles et halos bleu-vert.**

### Mots-clés

- cartographie ;
- réseau ;
- infrastructure ;
- trajectoire ;
- grille ;
- signal ;
- système ;
- précision ;
- profondeur ;
- calme ;
- contraste ;
- lumière contrôlée.

### Intensité visuelle

Le fond doit être clairement perceptible, mais ne jamais devenir le sujet principal.

Cible :

- visible au premier regard ;
- discret pendant la lecture ;
- plus expressif dans les grands espaces vides ;
- presque absent derrière les textes longs et les formulaires.

---

## 4. Palette recommandée

La palette exacte pourra être légèrement ajustée après vérification WCAG, mais l’IA doit partir de cette base.

### Neutres

```css
--background: #070b10;
--background-elevated: #0b1118;
--surface-1: #0e1620;
--surface-2: #121d29;
--surface-3: #182534;

--border-subtle: rgba(148, 163, 184, 0.12);
--border-default: rgba(148, 163, 184, 0.2);
--border-strong: rgba(148, 163, 184, 0.32);

--text-primary: #f4f8fc;
--text-secondary: #a9b8c7;
--text-muted: #74879a;
--text-disabled: #536372;
```

### Bleu de marque

```css
--blue-50: #eff8ff;
--blue-100: #dceeff;
--blue-200: #b9ddff;
--blue-300: #86c6ff;
--blue-400: #4aa7ff;
--blue-500: #2388f2;
--blue-600: #176dce;
--blue-700: #1757a5;
--blue-800: #184a86;
--blue-900: #193f6e;
--blue-950: #102847;
```

### Vert de marque

```css
--green-50: #edfff9;
--green-100: #d3fbef;
--green-200: #aaf5df;
--green-300: #71e9c8;
--green-400: #35d3ad;
--green-500: #14b894;
--green-600: #0c9478;
--green-700: #0d765f;
--green-800: #0f5e4d;
--green-900: #104d40;
--green-950: #072f28;
```

### Couleurs fonctionnelles

Ces couleurs ne font pas partie de la marque principale.

```css
--success: #22c55e;
--warning: #f59e0b;
--danger: #ef4444;
--info: #38bdf8;
```

### Gradient de marque

```css
--brand-gradient: linear-gradient(
  135deg,
  var(--blue-400) 0%,
  var(--blue-500) 38%,
  var(--green-400) 100%
);
```

Le gradient doit être utilisé avec parcimonie :

- logo animé facultatif ;
- halo principal ;
- CTA principal ;
- ligne active ;
- détails Open Graph.

Ne pas l’appliquer à tous les textes, cartes et bordures.

---

## 5. Répartition des couleurs

### Bleu

Couleur principale de Randy Code.

Utilisations :

- navigation active ;
- CTA principal ;
- liens ;
- focus ;
- connexions majeures de la carte ;
- composants de marque ;
- sections générales.

### Vert

Couleur secondaire et technique.

Utilisations :

- outils ;
- validation ;
- signaux positifs ;
- composants InfraLens ;
- détails de réseau ;
- badges open source ;
- états de progression non critiques.

### Pages

Les pages ne changent pas de palette complète.

#### Accueil

- dominante bleue ;
- connexions bleu-vert ;
- halo principal mixte.

#### Projets

- bleu dominant ;
- vert pour les résultats, preuves et technologies actives.

#### Outils

- équilibre bleu/vert ;
- InfraLens peut utiliser davantage de vert.

#### Articles

- bleu discret ;
- décor réduit pour favoriser la lecture.

#### À propos

- bleu dominant ;
- accent vert ponctuel.

#### Contact

- bleu dominant ;
- vert uniquement sur l’état de succès.

---

## 6. Background global

### Composition

Le background doit être composé de couches légères :

1. couleur de fond unie ;
2. gradient radial bleu principal ;
3. gradient radial vert secondaire ;
4. grille technique ;
5. lignes cartographiques ou topographiques ;
6. quelques nœuds et connexions ;
7. vignettage léger ;
8. grain très subtil facultatif.

### Exemple de structure DOM

```tsx
<div className="app-background" aria-hidden="true">
  <div className="app-background__glow app-background__glow--blue" />
  <div className="app-background__glow app-background__glow--green" />
  <div className="app-background__grid" />
  <div className="app-background__topography" />
  <div className="app-background__network" />
  <div className="app-background__vignette" />
</div>
```

### Règles

- un seul composant global ;
- monté dans le layout racine ;
- aucune duplication page par page ;
- opacités centralisées ;
- aucun événement pointer ;
- aucun impact sur le layout ;
- pas de canvas si CSS/SVG suffit ;
- pas d’image raster lourde ;
- pas d’animation réactive à la souris par défaut.

### Grille

La grille doit :

- être très fine ;
- rester à faible contraste ;
- être plus visible dans les zones vides ;
- disparaître progressivement sous les grandes surfaces de lecture.

Exemple :

```css
background-image:
  linear-gradient(rgba(100, 160, 220, 0.035) 1px, transparent 1px),
  linear-gradient(90deg, rgba(100, 160, 220, 0.035) 1px, transparent 1px);
background-size: 48px 48px;
```

### Halos

Utiliser au maximum :

- un grand halo bleu en haut ou au centre ;
- un halo vert plus petit et décentré ;
- éventuellement un halo local sous la carte.

Les halos doivent être fixes ou très lentement animés.

### Lignes topographiques

Utiliser un SVG réutilisable et léger.

Règles :

- opacité comprise entre 0.03 et 0.08 ;
- traits fins ;
- pas de répétition trop dense ;
- aucun motif figuratif ;
- aucune animation rapide.

### Réseau

Le réseau peut apparaître sous forme de :

- segments fins ;
- nœuds ronds ;
- embranchements ;
- routes interrompues.

Il doit rappeler le logo et la carte, sans reproduire exactement la navigation.

### Responsive

Sur mobile :

- réduire le nombre de couches ;
- simplifier le SVG ;
- réduire les blur ;
- désactiver certaines animations ;
- conserver une présence visuelle claire.

### Réduction des mouvements

```css
@media (prefers-reduced-motion: reduce) {
  .app-background * {
    animation: none !important;
    transform: none !important;
  }
}
```

---

## 7. Surfaces et cartes

### Surface principale

```css
background: rgba(14, 22, 32, 0.82);
border: 1px solid var(--border-subtle);
backdrop-filter: blur(14px);
```

Le blur doit être désactivé ou réduit sur les appareils où il nuit aux performances.

### Cartes

Les cartes doivent éviter :

- les contours multicolores ;
- les gros gradients ;
- les ombres lumineuses fortes ;
- les animations de translation excessives.

Hover recommandé :

- légère remontée ;
- bordure plus visible ;
- halo intérieur discret ;
- aucune rotation ;
- durée 160–220 ms.

### Bordures d’accent

Les bordures d’accent doivent rester rares.

Exemples valides :

- carte sélectionnée ;
- CTA ;
- résultat positif ;
- bloc outil.

---

## 8. Typographie

Conserver une police sans-serif moderne et très lisible.

Éviter :

- trop de polices ;
- les fontes sci-fi ;
- les polices monospace pour les paragraphes ;
- les titres entièrement en capitales.

Utiliser une monospace uniquement pour :

- labels techniques ;
- code ;
- métadonnées ;
- badges ;
- coordonnées ;
- statuts.

Hiérarchie recommandée :

- H1 fort, stable et lisible ;
- H2 plus compact ;
- corps de texte généreux ;
- labels monospace petits mais contrastés.

---

## 9. Nouveau logo Randy Code

### Décision

Conserver le **R** comme racine.

Le symbole doit évoluer en monogramme propriétaire, inspiré de :

- R ;
- C ;
- route ;
- embranchement ;
- réseau ;
- connexion.

### Concept principal recommandé

**Un R géométrique construit comme un chemin connecté.**

Caractéristiques :

- barre verticale claire ;
- boucle supérieure simplifiée ;
- ouverture négative suggérant un C ;
- jambe diagonale transformée en trajectoire ;
- un ou deux nœuds maximum ;
- géométrie simple ;
- épaisseur constante ou presque constante.

Le logo doit être compris comme un R immédiatement. La lecture du C ou du réseau doit venir en second.

### Ce qu’il ne faut pas faire

- écrire `</>` dans le logo ;
- multiplier les nœuds ;
- dessiner un circuit imprimé détaillé ;
- créer un logo trop fin ;
- utiliser une police décorative comme logo ;
- dessiner un RC littéral difficile à lire ;
- dépendre d’un gradient pour être compréhensible.

### Variantes obligatoires

```text
logo-symbol.svg
logo-horizontal.svg
logo-horizontal-light.svg
logo-horizontal-dark.svg
logo-monochrome.svg
favicon.svg
apple-touch-icon.png
icon-192.png
icon-512.png
opengraph-brand.svg
```

### Logo horizontal

Format recommandé :

```text
[symbole] Randy Code
```

Le texte doit rester simple. Le symbole porte la personnalité.

### Versions

- version principale claire sur fond sombre ;
- version sombre sur fond clair ;
- version monochrome ;
- version symbole seul ;
- version petite taille simplifiée si nécessaire.

### Zone de protection

La zone libre autour du symbole doit être au minimum égale à l’épaisseur de sa boucle principale.

### Test de validation

Le logo doit rester reconnaissable :

- à 16 px ;
- en monochrome ;
- sans gradient ;
- imprimé en petit ;
- dans un cercle GitHub ;
- dans une favicon carrée.

---

## 10. Relation avec Liflow

Le logo Liflow est considéré comme une identité produit réussie et ne doit pas être redessiné dans ce chantier.

Le portfolio doit le présenter fidèlement, sans tenter de le recolorer pour le faire correspondre artificiellement à Randy Code.

Règle :

- Randy Code fournit le cadre ;
- Liflow garde son identité émotionnelle propre ;
- les cartes projet s’adaptent aux visuels du produit sans imposer une recoloration.

La cohérence vient de la mise en page, des surfaces, de la typographie du portfolio et de la présentation, pas d’une uniformisation forcée de tous les logos.

---

## 11. Intégration d’InfraLens

InfraLens ne conservera pas son domaine autonome à terme.

Conséquence :

- InfraLens devient un outil nommé au sein de Randy Code ;
- son symbole peut être distinct ;
- sa typographie et ses tokens doivent rester compatibles avec Randy Code ;
- il ne faut pas créer une marque totalement indépendante exigeant son propre écosystème.

Présentation recommandée :

```text
InfraLens
Open-source website infrastructure inspector
by Randy Code
```

URL cible :

```text
randy-code.dev/tools/infralens
```

ou, techniquement si nécessaire :

```text
infralens.randy-code.dev
```

mais l’adresse principale communiquée reste celle de Randy Code.

---

## 12. Design tokens

Créer une source de vérité unique.

Exemple :

```ts
export const brand = {
  colors: {
    background: "#070B10",
    blue: {
      400: "#4AA7FF",
      500: "#2388F2",
      600: "#176DCE",
    },
    green: {
      400: "#35D3AD",
      500: "#14B894",
      600: "#0C9478",
    },
  },
  radius: {
    sm: "0.5rem",
    md: "0.75rem",
    lg: "1rem",
    xl: "1.5rem",
  },
  motion: {
    fast: 160,
    normal: 220,
    slow: 600,
  },
} as const;
```

Les tokens peuvent être exposés via CSS et TypeScript si nécessaire.

Ne pas importer directement des hexadécimaux dans les composants.

---

## 13. Plan d’implémentation

### Phase B0 — Inventaire visuel

- relever toutes les couleurs actuelles ;
- identifier les composants dépendants d’une couleur de zone ;
- inventorier les fonds, ombres, bordures et gradients ;
- inventorier les logos et favicons ;
- inventorier les assets Open Graph ;
- documenter les contrastes problématiques.

Livrable :
`docs/branding/VISUAL_BASELINE.md`

### Phase B1 — Tokens

- introduire les nouveaux tokens ;
- conserver temporairement les anciens alias ;
- ne modifier aucun layout important ;
- ajouter des tests visuels de base si disponibles.

Critère :
aucun nouveau composant n’utilise une couleur brute.

### Phase B2 — Background global

- créer le composant global ;
- intégrer grille, halos et topographie ;
- vérifier toutes les pages ;
- ajouter le mode reduced-motion ;
- vérifier mobile et performance.

### Phase B3 — Surfaces

- harmoniser cartes, panels, headers et footer ;
- réduire les gradients concurrents ;
- uniformiser les bordures ;
- revoir hover et focus.

### Phase B4 — Navigation et carte

- adapter la carte à la palette bleu-vert ;
- conserver la distinction des zones via icône, libellé, position et intensité ;
- supprimer la dépendance aux couleurs multiples ;
- garder les connexions cohérentes avec le background.

### Phase B5 — Logo Randy Code

- produire plusieurs pistes SVG ;
- valider une direction ;
- créer les variantes ;
- remplacer favicon, header, footer, Open Graph et PWA ;
- documenter les usages.

### Phase B6 — Intégration InfraLens

- appliquer la signature `by Randy Code` ;
- créer la transition visuelle entre la page Outils et InfraLens ;
- aligner les tokens sans rendre l’outil identique au portfolio.

### Phase B7 — QA

- contraste ;
- responsive ;
- reduced-motion ;
- Lighthouse ;
- cohérence des pages ;
- images Open Graph ;
- favicon ;
- absence de couleurs obsolètes ;
- absence de flash de thème.

---

## 14. Critères d’acceptation

Le chantier branding est terminé lorsque :

- toutes les pages utilisent le même système de fond ;
- la palette principale est bleu-vert ;
- les anciennes couleurs de zone ne dominent plus l’interface ;
- le site reste lisible sur mobile ;
- le background est visible sans gêner la lecture ;
- le logo Randy Code est propriétaire et reconnaissable ;
- le logo fonctionne à 16 px ;
- InfraLens est clairement rattaché à Randy Code ;
- Liflow conserve sa propre identité ;
- les états warning/error ne sont pas confondus avec les couleurs de marque ;
- les tokens remplacent les couleurs dispersées ;
- les animations respectent `prefers-reduced-motion`;
- les scores de contraste sont conformes ;
- aucun asset ne dépend du domaine infralens.dev ;
- les favicons et images Open Graph sont à jour.

---

## 15. Prompt de démarrage pour l’IA

```text
Lis intégralement :
- RANDY_CODE_MASTER_PLAN.md
- RANDY_CODE_BRANDING_PLAN.md

Considère le premier comme source de vérité pour la structure et le contenu, et le second comme source de vérité pour l’identité visuelle.

Commence uniquement par la Phase B0 — Inventaire visuel.

Ne refonds pas encore l’interface.
Ne crée pas encore le nouveau logo.
Ne supprime pas encore les anciennes couleurs.

Analyse le code réel et crée `docs/branding/VISUAL_BASELINE.md` avec :
1. toutes les couleurs et variables existantes ;
2. les composants liés aux couleurs de zones ;
3. les fonds, gradients, bordures et ombres ;
4. les assets logo, favicon, PWA et Open Graph ;
5. les problèmes de contraste ou de cohérence ;
6. la stratégie de migration vers les tokens bleu-vert ;
7. les risques de régression ;
8. les critères de validation de la phase.

À la fin, indique les commandes exécutées, les fichiers examinés et les décisions nécessitant une validation humaine.
```
