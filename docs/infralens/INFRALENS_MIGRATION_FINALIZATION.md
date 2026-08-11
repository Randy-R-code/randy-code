# INFRALENS_MIGRATION_FINALIZATION.md

> Finalisation de la migration réussie d'InfraLens dans `randy-code`.
>
> **But :** terminer l'intégration proprement sans refactorer le moteur
> InfraLens ni modifier ce qui fonctionne déjà.

## Décisions définitives

- InfraLens vit nativement dans `randy-code` à `/tools/infralens`.
- **InfraLens reste en anglais.**
- Randy Code et le catalogue `/tools` restent en français.
- Les futurs outils développeur (InfraLens, MetaLens, JSON Studio,
  Cron Builder) auront leur interface en anglais.
- Garder **uniquement la PWA globale Randy Code**.
- Ne pas restaurer la PWA, le manifest, le service worker, l'offline
  page ou l'install prompt InfraLens.
- Le **design system et la palette Randy Code sont la source de
  vérité**.
- Ne pas récupérer/restaurer l'ancien thème global InfraLens.
- InfraLens garde son identité via son logo, son nom, son UI technique
  et son accent vert lorsque pertinent.
- Garder uniquement le footer global Randy Code.
- Ne pas refactorer les checks, scoring, SSRF, DNS/TLS, historique,
  exports, comparaison ou tests pendant cette passe.

## 1. Nettoyer les dernières traces de migration

Rechercher dans tout le repo :

```bash
rg "infralens.dev"
rg "INFRALENS_ORIGIN"
rg "basePath"
rg "serviceWorker"
rg "beforeinstallprompt"
rg "manifest.json"
rg "offline.html"
```

Supprimer toute dépendance active à : - l'ancien domaine ; - l'ancien
proxy/rewrite ; - `INFRALENS_ORIGIN` ; - l'ancien `basePath` InfraLens
; - la PWA InfraLens ; - les expérimentations multi-zone/microfrontend.

Les mentions historiques peuvent rester uniquement si elles sont
réellement utiles.

Tous les liens produit actifs doivent pointer vers `/tools/infralens`,
notamment : - homepage ; - `/tools` ; - étude de cas ; - CTA ; -
documentation ; - metadata.

Retirer les mentions devenues fausses indiquant qu'InfraLens est une PWA
autonome installable.

## 2. Harmoniser visuellement InfraLens avec Randy Code

Ne pas importer ni recréer l'ancien `globals.css` InfraLens.

Utiliser comme source de vérité les tokens Randy Code : - background ; -
surfaces ; - borders ; - foreground ; - muted ; - typography ; - radii
; - shadows ; - palette bleu/vert.

Supprimer les `bg-zinc-*`, `text-zinc-*`, `border-zinc-*` restants
lorsqu'ils représentent l'ancien thème global InfraLens.

Préférer les tokens/classes sémantiques Randy Code.

InfraLens peut garder son vert pour : - logo ; - action principale si
approprié ; - certains highlights ; - succès.

**Conserver les couleurs fonctionnelles warning/error/success
nécessaires aux résultats.** Ne pas sacrifier la sémantique métier au
branding.

Objectif : InfraLens doit ressembler à **un outil distinct appartenant à
Randy Code**, pas à un second site embarqué.

## 3. Langue

Ne pas traduire InfraLens.

Garder en anglais : - hero ; - formulaire ; - boutons ; - rapports ; -
filtres ; - recommandations ; - Compare ; - Docs ; - explications ; -
erreurs appropriées.

Convention :

```text
/tools                  → français
/tools/infralens        → anglais
/tools/metalens         → anglais
/tools/json-studio      → anglais
/tools/cron-builder     → anglais
```

Ne pas ajouter d'infrastructure i18n maintenant.

## 4. Cards `/tools`

Supprimer le CTA redondant `Lancer l'outil`.

Garder : - **`Ouvrir l'outil`** → action primaire vers
`/tools/infralens`; - **`Étude de cas`** → action secondaire vers
l'étude de cas.

Structure souhaitée :

```text
[Logo InfraLens]                         Disponible

InfraLens
Description française concise.

DNS · TLS · Security · Metadata

[ Ouvrir l'outil → ]    Étude de cas
```

Utiliser cette hiérarchie comme modèle pour MetaLens, JSON Studio et
Cron Builder.

Ajouter/utiliser le symbole InfraLens sur la card s'il existe déjà.

Ne pas surcharger visuellement les cards.

## 5. Shell InfraLens

Conserver un seul footer : Randy Code.

Ne pas remettre de footer InfraLens.

Garder un retour léger, de préférence :

```text
← Tous les outils
```

Supprimer les wrappers Zinc qui empêchent le background Randy Code de se
prolonger naturellement.

Une mini-navigation locale est acceptable si elle améliore réellement
l'accès :

```text
Analyze · Compare · Documentation
```

Elle ne doit pas devenir un second header complet.

Privacy n'a pas besoin d'être un onglet principal.

## 6. Landing InfraLens

Ne pas refaire la landing.

Conserver : - identité InfraLens ; - proposition de valeur ; - input URL
; - CTA analyse ; - signaux trust/privacy ; - aperçu du rapport ; - What
it checks ; - Open Source ; - CTA final s'il reste utile.

Vérifier si `How results are presented` fait doublon avec l'aperçu du
rapport.

Si oui, condenser ou fusionner la partie réellement utile. Ne pas
retirer d'information technique utile uniquement pour raccourcir la
page.

Le formulaire d'analyse reste l'action dominante au-dessus de la ligne
de flottaison.

## 7. Homepage et étude de cas

Mettre à jour l'étude de cas : - InfraLens est maintenant intégré à
Randy Code ; - URL publique : `/tools/infralens`; - plus de PWA
InfraLens autonome ; - conserver la mise en avant du travail technique
et open source.

Tous les `Voir le produit` doivent pointer vers `/tools/infralens`.

Faire la même correction sur la homepage.

Aucun lien actif vers `infralens.dev`.

## 8. Metadata / SEO

Canonical :

```text
https://randy-code.dev/tools/infralens
```

Vérifier : - title ; - description ; - canonical ; - Open Graph URL ; -
Open Graph image ; - Twitter metadata si présente ; - structured data
; - sitemap ; - robots.

Aucune canonical vers l'ancien domaine.

Garder le SEO InfraLens en anglais puisque l'outil est anglais.

## 9. Assets

Conserver les assets InfraLens namespacés, idéalement :

```text
/public/infralens/
```

Vérifier : - logos ; - Open Graph ; - chemins ; - absence d'écrasement
des favicons globaux.

Randy Code possède : - favicon global ; - PWA icons ; - manifest ; -
service worker.

InfraLens possède uniquement ses assets de branding locaux.

## 10. PWA Randy Code

Ne pas créer une seconde PWA.

Vérifier que le SW global Randy Code ne casse pas InfraLens.

Ne pas mettre en cache : - POST ; - Server Actions ; - résultats
d'analyse dynamiques.

InfraLens nécessite le réseau pour analyser.

Le cache global peut concerner shell/assets statiques.

Le nettoyage de cache ne doit supprimer que les caches appartenant à
Randy Code.

## 11. Préserver 100 % des fonctions InfraLens

Cette passe ne doit modifier/supprimer aucun des éléments suivants : -
18 checks ; - orchestration/concurrence ; - SSRF ; - IP policy ; -
safe-fetch ; - redirects validation ; - DNS ; - DNS cache ; - TLS ; -
scoring ; - category scores ; - grades ; - recommendations ; - priority
summary ; - filters ; - JSON export ; - Markdown export ; - comparison
; - comparison export ; - local history ; - rate limiting ; - IPAPI
optionnel ; - docs ; - privacy ; - responsive ; - accessibility.

Ne refactorer ces systèmes que si un test prouve un problème
d'intégration.

## 12. Tests : zéro régression

Conserver tous les tests unitaires migrés hors PWA.

Conserver les E2E pertinents : - landing ; - analysis ; - compare ; -
accessibility ; - real-network smoke test.

Les tests exclusivement liés à l'ancienne PWA InfraLens sont les seuls
pouvant avoir disparu.

Interdit : - supprimer un test failing ; - ajouter un skip pour passer
la CI ; - affaiblir une assertion pour masquer une régression.

Lancer au minimum les équivalents réellement disponibles de :

```bash
pnpm lint
pnpm typecheck
pnpm test --run
pnpm build
pnpm e2e
```

ainsi que le script E2E InfraLens dédié s'il existe.

Préserver la sérialisation/faible concurrence des E2E InfraLens si le
rate limiter l'exige.

## 13. Validation manuelle

Valider :

```text
/tools
/tools/infralens
/tools/infralens/compare
/tools/infralens/docs
/tools/infralens/privacy
/projects/infralens
```

Vérifier : - desktop ; - mobile ; - pas d'overflow horizontal ; - aucun
contenu non stylé ; - aucune erreur console ; - aucun asset CSS/JS cassé
; - aucune requête vers l'ancien domaine ; - aucune image cassée ; - pas
de footer doublé ; - pas de CTA lancement doublé ; - thème Randy Code
cohérent ; - identité InfraLens conservée ; - analyse ; - résultats ; -
filtres ; - exports ; - historique ; - comparaison ; - docs ; -
accessibilité.

Tester au minimum : - `example.com`; - domaine HTTPS public réel ; - URL
invalide ; - localhost/IP privée ; - domaine inexistant.

## 14. Recherche finale

Avant de déclarer terminé :

```bash
rg "infralens.dev"
rg "INFRALENS_ORIGIN"
rg "beforeinstallprompt"
rg "serviceWorker"
rg "offline.html"
```

Aucune dépendance runtime InfraLens obsolète ne doit rester.

Inspecter également le diff Git pour détecter toute modification
accidentelle du moteur d'analyse.

## 15. Definition of Done

La finalisation est terminée uniquement si :

1.  InfraLens fonctionne nativement à `/tools/infralens`.
2.  Il appartient visuellement à Randy Code.
3.  Son identité InfraLens reste reconnaissable.
4.  InfraLens reste en anglais.
5.  `/tools` reste en français.
6.  Un seul footer global Randy Code.
7.  Une seule PWA globale Randy Code.
8.  Une seule action primaire `Ouvrir l'outil` + `Étude de cas`.
9.  Aucune dépendance active à `infralens.dev`.
10. Aucune PWA InfraLens spécifique.
11. Les 18 checks et toutes les fonctionnalités hors PWA restent
    présents.
12. Unit tests verts.
13. E2E verts.
14. Accessibilité verte.
15. Build production vert.
16. Aucune erreur console/réseau.
17. Homepage et étude de cas pointent vers `/tools/infralens`.
18. Canonical/OG pointent vers Randy Code.
19. Aucun refactor inutile introduit.

## Instruction finale à l'agent

Il s'agit d'une **passe de finalisation**, pas d'une nouvelle migration
ni d'une refonte.

Inspecte l'état actuel avant toute modification : la migration
fonctionne déjà.

Effectue le plus petit ensemble cohérent de changements permettant : -
de retirer les traces obsolètes ; - d'harmoniser InfraLens avec Randy
Code ; - de corriger l'UX des cards `/tools`; - de conserver l'anglais
dans InfraLens ; - de mettre à jour les contenus/liens obsolètes ; - de
tout valider exhaustivement.

À la fin, fournir : - fichiers modifiés ; - fichiers obsolètes supprimés
; - changements visuels ; - liens/contenus corrigés ; - commandes/tests
exécutés et résultats ; - différences intentionnelles restantes par
rapport à l'ancien InfraLens.

Ne déclarer terminé que lorsque build et suites de tests sont verts.
