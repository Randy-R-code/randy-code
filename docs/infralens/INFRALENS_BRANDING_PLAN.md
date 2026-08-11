# INFRALENS — BRANDING & INTEGRATION PLAN

> Document complémentaire à `INFRALENS_MASTER_PLAN.md`.
>
> Ce fichier définit uniquement l’identité visuelle, le logo, la relation avec Randy Code, les tokens et la migration liée à l’abandon futur du domaine `infralens.dev`.

---

## 0. Décision stratégique

InfraLens reste :

- un outil open source ;
- un dépôt indépendant ;
- une application techniquement autonome si nécessaire ;
- un produit sans compte, abonnement ou logique SaaS.

InfraLens ne reste pas :

- une marque totalement indépendante ;
- un produit dépendant du domaine `infralens.dev` ;
- un écosystème nécessitant sa propre identité complète.

Le domaine `infralens.dev` ne sera pas renouvelé à terme.

La marque affichée devient simplement :

**InfraLens**

Signature recommandée :

> InfraLens — an open-source tool by Randy Code

URL publique cible :

`randy-code.dev/tools/infralens`

Une architecture technique via sous-domaine ou rewrite reste possible, mais ne doit pas modifier la marque communiquée.

---

## 1. Objectif visuel

InfraLens doit sembler :

- plus technique que le portfolio ;
- plus dense et plus fonctionnel ;
- précis ;
- fiable ;
- lisible ;
- ouvert ;
- directement relié à Randy Code.

Il ne doit pas sembler :

- être une société autonome ;
- être un SaaS commercial ;
- être une copie visuelle exacte du portfolio ;
- être une simple page interne sans personnalité ;
- être une interface de cybersécurité alarmiste.

---

## 2. Relation avec Randy Code

### Éléments communs

- même famille de couleurs bleu-vert ;
- mêmes neutres sombres ;
- même logique de traits géométriques ;
- mêmes rayons principaux ;
- même niveau de sobriété ;
- même qualité typographique ;
- même signature de mouvement ;
- même approche des surfaces.

### Éléments propres à InfraLens

- vert plus présent ;
- grille plus régulière ;
- symbole d’inspection ;
- densité d’information plus forte ;
- halos réduits dans les résultats ;
- composants de score et de diagnostic spécifiques.

### Signature

Afficher discrètement dans le header ou le footer :

```text
InfraLens
by Randy Code
```

Ne pas afficher `infralens.dev` comme nom.

---

## 3. Palette

InfraLens réutilise la palette Randy Code.

### Accent principal

Vert technique :

```css
--infralens-accent: #14b894;
--infralens-accent-hover: #35d3ad;
--infralens-accent-strong: #0c9478;
```

### Accent secondaire

Bleu :

```css
--infralens-secondary: #2388f2;
--infralens-secondary-hover: #4aa7ff;
```

### Règle

Le vert représente :

- inspection réussie ;
- outil ;
- signal ;
- disponibilité ;
- action principale.

Mais le vert de marque ne doit pas remplacer tous les états.

Les statuts doivent rester sémantiques :

- succès ;
- information ;
- avertissement ;
- erreur ;
- indisponible ;
- non applicable.

---

## 4. Background InfraLens

Le background doit dériver du portfolio, mais être simplifié.

### Hero et formulaire

Autoriser :

- grille fine ;
- halo vert principal ;
- halo bleu secondaire ;
- quelques lignes ou nœuds ;
- profondeur visible.

### Résultats

Réduire progressivement le décor :

- fond plus uniforme ;
- grille moins visible ;
- aucune ligne derrière les tableaux ;
- surfaces plus opaques ;
- contraste maximal.

### Règles

- aucun décor animé derrière les rapports ;
- aucune particule ;
- aucun effet de scan agressif ;
- pas de radar en boucle ;
- pas de clignotement ;
- reduced-motion obligatoire.

---

## 5. Nouveau logo InfraLens

> **Note (Phase 11, 2026-08-09)** : le logo effectivement livré et intégré est une loupe stylisée — écart assumé par rapport à la recommandation ci-dessous. Décision explicite du porteur du projet à réception d'assets finis en PNG (pas de source SVG) ; conservé tel quel plutôt que redemandé ou retravaillé. Le reste de cette section documente l'intention de conception initiale, pas l'état livré.

### Concept recommandé

**Une lentille abstraite contenant des couches d’infrastructure et un point focal.**

Le symbole doit évoquer :

- inspection ;
- profondeur ;
- couches ;
- réseau ;
- signal ;
- ciblage.

Il ne doit pas être :

- une loupe classique ;
- un œil réaliste ;
- un bouclier ;
- un cadenas ;
- un globe générique ;
- un symbole de hacker ;
- un radar détaillé.

### Construction suggérée

Forme de base :

- cercle ou anneau incomplet ;
- trois segments internes ou niveaux ;
- un point focal ;
- une ouverture orientée vers la droite ou le haut ;
- éventuellement un nœud externe unique.

Le logo doit rester lisible à 16 px.

### Relation graphique avec Randy Code

Utiliser :

- même épaisseur de trait ;
- mêmes terminaisons ;
- mêmes proportions de coins ;
- même discipline géométrique.

Ne pas reprendre le R ou le C dans le symbole InfraLens.

### Variantes obligatoires

```text
infralens-symbol.svg
infralens-horizontal.svg
infralens-horizontal-light.svg
infralens-horizontal-dark.svg
infralens-monochrome.svg
favicon.svg
icon-192.png
icon-512.png
apple-touch-icon.png
opengraph-infralens.svg
```

### Wordmark

Utiliser simplement :

**InfraLens**

Capitalisation exacte :

- I majuscule ;
- L majuscule ;
- aucune extension ;
- aucun point ;
- aucun suffixe `.dev`.

---

## 6. Suppression de la dépendance au domaine

L’IA doit rechercher et supprimer les dépendances de marque liées à `infralens.dev`.

Inventorier :

- titres ;
- logos ;
- métadonnées ;
- Open Graph ;
- manifest ;
- README ;
- captures ;
- exemples ;
- textes du footer ;
- canonical ;
- liens absolus ;
- variables d’environnement ;
- badges ;
- documentation ;
- commentaires ;
- tests ;
- assets.

Ne pas supprimer le domaine avant la phase de migration effective si une redirection temporaire doit encore fonctionner.

Créer une couche de configuration :

```ts
export const siteConfig = {
  name: "InfraLens",
  parentBrand: "Randy Code",
  canonicalUrl: "https://randy-code.dev/tools/infralens",
  repositoryUrl: "https://github.com/Randy-R-code/infralens",
} as const;
```

Éviter tout domaine codé en dur hors configuration.

---

## 7. Header recommandé

Structure :

```text
[logo InfraLens] InfraLens
Open-source website infrastructure inspector

GitHub
Documentation
About
[Analyze a website]
```

Ajouter une signature discrète :

```text
by Randy Code
```

La signature peut pointer vers le portfolio.

Ne pas ajouter :

- pricing ;
- login ;
- signup ;
- dashboard ;
- account ;
- upgrade.

---

## 8. Footer recommandé

Contenu minimal :

```text
InfraLens
Open source website inspection tool.

Built by Randy Code
GitHub
Documentation
Security
License
```

Ne pas afficher le domaine expirant comme marque.

---

## 9. Composants spécifiques

### Score

Le score peut utiliser un anneau ou une jauge, mais :

- ne pas dépendre uniquement de la couleur ;
- afficher la valeur et le libellé ;
- distinguer score et confiance ;
- éviter les grosses animations.

### Catégories

Utiliser :

- icône simple ;
- nom ;
- score ;
- état ;
- barre de progression facultative.

Les catégories ne doivent pas recevoir six couleurs de marque différentes.

### Statuts

Utiliser des couleurs sémantiques, icônes et labels.

Exemples :

- Pass ;
- Warning ;
- Fail ;
- Unavailable ;
- Informational ;
- Not applicable.

### Recommandations

Hiérarchie :

- priorité élevée ;
- priorité moyenne ;
- amélioration ;
- information.

Le design doit éviter un mur de rouge.

---

## 10. Plan d’implémentation

### Phase IB0 — Inventaire

- assets ;
- occurrences de `infralens.dev` ;
- couleurs ;
- logos ;
- manifest ;
- metadata ;
- Open Graph ;
- screenshots ;
- README ;
- documentation.

Livrable :
`docs/branding/INFRALENS_VISUAL_BASELINE.md`

### Phase IB1 — Configuration de marque

- introduire `siteConfig` ;
- centraliser nom, URL cible et dépôt ;
- remplacer les chaînes dispersées ;
- conserver la compatibilité temporaire avec le domaine actuel.

### Phase IB2 — Tokens partagés

- aligner les neutres avec Randy Code ;
- introduire vert et bleu ;
- supprimer les couleurs arbitraires ;
- préserver les couleurs sémantiques.

### Phase IB3 — Background

- créer le fond simplifié ;
- limiter le décor au hero ;
- réduire le décor dans les résultats ;
- vérifier mobile et reduced-motion.

### Phase IB4 — Logo InfraLens

- produire plusieurs pistes SVG ;
- choisir une direction ;
- créer les variantes ;
- remplacer favicon, PWA et Open Graph.

### Phase IB5 — Signature Randy Code

- ajouter `by Randy Code` ;
- créer les liens retour ;
- harmoniser header/footer ;
- vérifier que l’outil garde son autonomie fonctionnelle.

### Phase IB6 — Migration du domaine

- définir l’URL canonique ;
- mettre en place les rewrites ou la nouvelle route ;
- rediriger temporairement le domaine existant si encore actif ;
- mettre à jour GitHub et documentation ;
- vérifier les assets absolus ;
- vérifier la PWA ;
- vérifier les exports.

### Phase IB7 — QA

- contraste ;
- responsive ;
- PWA ;
- manifest ;
- favicon ;
- Open Graph ;
- canonical ;
- absence de dépendance au domaine expirant ;
- cohérence avec Randy Code ;
- lisibilité des résultats.

---

## 11. Critères d’acceptation

- la marque affichée est `InfraLens` ;
- `infralens.dev` n’est plus utilisé comme nom ;
- l’outil est clairement signé par Randy Code ;
- le logo fonctionne à 16 px ;
- le fond reste discret dans les rapports ;
- l’interface ne ressemble pas à un SaaS ;
- aucun CTA commercial n’est ajouté ;
- les couleurs de statut restent sémantiques ;
- la palette est cohérente avec Randy Code ;
- l’URL canonique cible le portfolio ;
- aucun asset essentiel ne dépend du domaine expirant ;
- GitHub, PWA et Open Graph utilisent la nouvelle identité ;
- le dépôt reste autonome ;
- Liflow n’est pas utilisé comme référence graphique directe pour InfraLens.

---

## 12. Prompt de démarrage pour l’IA

```text
Lis intégralement :
- INFRALENS_MASTER_PLAN.md
- INFRALENS_BRANDING_PLAN.md

Le premier définit le produit et les améliorations fonctionnelles.
Le second définit l’identité visuelle, la relation avec Randy Code et la migration hors du domaine infralens.dev.

Commence uniquement par la Phase IB0 — Inventaire.

Ne crée pas encore le nouveau logo.
Ne change pas encore le domaine canonique.
Ne supprime aucune compatibilité existante.

Crée `docs/branding/INFRALENS_VISUAL_BASELINE.md` contenant :
1. toutes les occurrences de `infralens.dev` ;
2. tous les assets logo, favicon, PWA et Open Graph ;
3. les couleurs et tokens actuels ;
4. les composants dépendants de l’identité actuelle ;
5. les URLs codées en dur ;
6. les risques liés à la migration vers `randy-code.dev/tools/infralens` ;
7. les contraintes PWA et manifest ;
8. la stratégie de migration par étapes ;
9. les critères de validation.

À la fin, fournis les commandes exécutées, les fichiers examinés et les points nécessitant une validation humaine.
```
