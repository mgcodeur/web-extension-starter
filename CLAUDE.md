# CLAUDE.md

Extensions navigateur avec WXT, Vue 3, Pinia, TypeScript et Tailwind CSS.

## Commandes

```bash
pnpm dev       # développement sous Chrome (dev:firefox pour Firefox)
pnpm build     # build de production dans .output/ (build:firefox)
pnpm zip       # archive pour les stores (zip:firefox)
pnpm compile   # vérification des types avec vue-tsc
pnpm lint      # ESLint (lint:fix pour corriger)
pnpm format    # Prettier (format:check pour vérifier sans modifier)
pnpm release   # version, CHANGELOG.md, tag et release GitHub (exige GITHUB_TOKEN)
```

Avant de terminer une tâche, `compile`, `lint`, `format:check` et `build` doivent passer.

Les commits suivent Conventional Commits : Husky lance `commitlint` sur le message et `lint-staged` sur les fichiers indexés.

## Architecture

Le code est organisé par domaine métier, pas par couche technique.

```text
src/                     # srcDir: 'src' dans wxt.config.ts
├── entrypoints/         # background, content scripts, popup, options
├── domains/
│   └── bookmarks/       # exemple de domaine
│       ├── components/
│       ├── composables/
│       ├── services/    # logique métier et appels aux API navigateur
│       ├── stores/
│       └── types.ts
└── shared/              # code générique utilisé par au moins deux domaines
```

- Un domaine regroupe tout ce qui concerne sa fonctionnalité et ne crée que les sous-dossiers dont il a besoin.
- Un domaine n'utilise que les `services/` et `types.ts` d'un autre domaine, jamais ses composants, composables ou stores.
- `shared/` n'importe aucun domaine.
- `entrypoints/` assemble les domaines et ne contient aucune logique métier.

## Principes

- Appliquer Clean Code, SOLID, KISS et DRY sans sur-ingénierie.
- Une fonction ou un composant a une seule responsabilité. Si son nom a besoin de « et », le découper.
- Chercher l'existant dans le domaine et `shared/` avant d'écrire du nouveau code, et suivre les conventions en place.
- N'abstraire que pour un besoin réel et présent, jamais par anticipation.

## Nommage

- Les noms décrivent précisément la responsabilité. Proscrire `data`, `item`, `x`, `temp`, `handleStuff` et équivalents.
- Identifiants et commentaires sont en anglais.
- Composant : `BookmarkList.vue`
- Composable : `useBookmarkSearch.ts`
- Store : `useBookmarksStore` dans `bookmarksStore.ts`
- Service : `bookmarkSyncService.ts`

## Commentaires

Le code doit se comprendre sans commentaire. S'il en faut un, il explique le pourquoi, tient en une ou deux lignes et se place au-dessus de la fonction ou de la classe, dans un style sobre à la Laravel :

```ts
/**
 * Batch writes to stay under the storage.sync quota of 120 writes per minute.
 */
function queueBookmarkSync(bookmark: Bookmark): void {
```

Pas de longs blocs de documentation, ni de `@param` ou `@returns` qui répètent les types.

## TypeScript

- Pas de `any` ni de `@ts-ignore`. Les données externes (messages, réseau, page web) sont typées `unknown` puis validées.
- Types explicites sur les signatures exportées, interfaces pour les objets métier.
- Éviter les assertions `as` : corriger le type plutôt que le forcer.
- Rester sur TypeScript 6.0 tant que `typescript-eslint` n'accepte pas de version supérieure.

## Vue 3 et Pinia

- Uniquement `<script setup lang="ts">` et la Composition API, avec `defineProps<T>()` et `defineEmits<T>()` typés.
- Un composant affiche et délègue : la logique réactive réutilisable va dans un composable, la logique métier dans un service.
- Stores au format setup (`defineStore('bookmarks', () => { ... })`), rangés dans leur domaine et limités à l'état partagé entre composants.
- Déstructurer un store avec `storeToRefs`.

## Tailwind CSS

- **Installation** : Tailwind v4 avec le plugin `@tailwindcss/vite`, enregistré dans l'option `vite` de `wxt.config.ts`.
- **Styles** : classes utilitaires dans les templates, `<style scoped>` uniquement pour ce que Tailwind n'exprime pas.
- **Réutilisation** : extraire un composant Vue plutôt que recourir à `@apply`.
- **Thème** : couleurs et tailles récurrentes déclarées avec `@theme` dans `src/shared/styles/tailwind.css`, pas de valeurs arbitraires répétées comme `text-[#1a2b3c]`.
- **Classes dynamiques** : écrire les noms en entier, jamais `bg-${color}-600`, car Tailwind analyse les sources comme du texte brut.
- **Content scripts** : importer la feuille Tailwind dans l'entrypoint, sans `?inline`, et laisser `createShadowRootUi` l'injecter dans le shadow root. WXT déplace déjà les `@property` vers la page hôte, aucune réécriture manuelle du CSS n'est nécessaire. Ne jamais l'injecter hors shadow root : son reset (Preflight) modifierait les styles de la page. Les `rem` restent relatifs à la police racine de cette page : tester l'UI injectée sur des sites qui la changent.

## WXT et contextes d'extension

- **Entrypoints** : zéro ou un niveau de profondeur. Les fichiers annexes vont dans un sous-dossier (`entrypoints/popup/`), sinon WXT les traite comme des entrypoints. Il en faut au moins un, sinon `wxt prepare` échoue et bloque `pnpm install`.
- **`main()`** : tout le code d'exécution y est placé, car WXT importe les entrypoints dans Node au build.
- **État** : chaque contexte (popup, options, content script) a sa propre instance Pinia, perdue à sa fermeture. L'état durable passe par `storage.defineItem` et les contextes communiquent par messages typés, tous deux déclarés dans le domaine concerné.
- **Background** : ni Vue ni Pinia, aucun état en mémoire car le service worker peut s'arrêter à tout moment, et des listeners enregistrés de façon synchrone dans `main()`.
- **Content scripts** : utiliser `ctx.addEventListener`, `ctx.setTimeout`, etc. pour stopper le travail quand le contexte est invalidé. Une UI Vue injectée passe par `createShadowRootUi` avec `cssInjectionMode: 'ui'`.
- **API navigateur** : utiliser `browser` de WXT, jamais `chrome.*`.
- **Imports** : `domains/` et `shared/` ne sont pas auto-importés, les importer explicitement via `@/`. Les alias se déclarent dans `wxt.config.ts`, pas dans `tsconfig.json`.
- **Manifeste** : déclaré dans `wxt.config.ts`, avec les permissions strictement nécessaires.
- **Icônes** : `public/icon/{16,32,48,96,128}.png`, détectées automatiquement par WXT.
- **Fichiers générés** : ne jamais modifier `.wxt/` ni `.output/`.
