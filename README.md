# Web Extension Starter

A cross-browser extension starter built with [WXT](https://wxt.dev), Vue 3, Pinia, TypeScript and Tailwind CSS v4. It includes an example popup, a folder structure organized by feature, and tooling for linting, formatting, commits and releases.

## Stack

- **WXT**: dev server with hot reload, manifest generation, Chrome and Firefox builds
- **Vue 3** with `<script setup>` and **Pinia**
- **TypeScript** in strict mode, type-checked with `vue-tsc`
- **Tailwind CSS v4** through `@tailwindcss/vite`
- **ESLint** (`typescript-eslint` strict, `eslint-plugin-vue`) and **Prettier**
- **Husky**, **lint-staged** and **commitlint**
- **release-it** with a conventional changelog

## Requirements

- Node.js `^22.22.2`, `^24.15.0` or `>=26.0.0`
- pnpm

## Getting started

```bash
git clone https://github.com/mgcodeur/web-extension-starter.git my-extension
cd my-extension
pnpm install
pnpm dev
```

`pnpm install` generates WXT types in `.wxt/` and installs the Git hooks. `pnpm dev` opens Chrome with the extension loaded and reloads it on every change. Use `pnpm dev:firefox` for Firefox.

## Scripts

| Command                             | Description                                                         |
| ----------------------------------- | ------------------------------------------------------------------- |
| `pnpm dev` / `pnpm dev:firefox`     | Start a browser with the extension loaded and hot reload            |
| `pnpm build` / `pnpm build:firefox` | Build for production into `.output/`                                |
| `pnpm zip` / `pnpm zip:firefox`     | Build and zip the extension for store submission                    |
| `pnpm compile`                      | Type-check with `vue-tsc`                                           |
| `pnpm lint` / `pnpm lint:fix`       | Run ESLint                                                          |
| `pnpm format` / `pnpm format:check` | Run Prettier                                                        |
| `pnpm release`                      | Bump the version, update the changelog and publish a GitHub release |

## Loading a production build

- **Chrome**: open `chrome://extensions`, enable Developer mode, click **Load unpacked** and select `.output/chrome-mv3`.
- **Firefox**: open `about:debugging#/runtime/this-firefox`, click **Load Temporary Add-on** and select `.output/firefox-mv2/manifest.json`.

## Project structure

```text
src/
├── entrypoints/             # background, popup, content scripts, options
│   ├── background.ts
│   └── popup/
├── domains/                 # one folder per feature
│   └── extension-info/
│       ├── assets/
│       ├── components/
│       ├── services/
│       └── types.ts
└── shared/                  # generic code used by at least two domains
    └── styles/tailwind.css
public/icon/                 # 16, 32, 48, 96 and 128 px icons
wxt.config.ts                # WXT, manifest and Vite configuration
```

Code is grouped by feature, not by technical layer:

- A domain holds everything its feature needs (components, composables, services, stores, types) and only creates the folders it uses.
- A domain may import another domain's `services/` and `types.ts`, never its components, composables or stores.
- `shared/` never imports from a domain.
- `entrypoints/` wires domains together and contains no business logic.

WXT does not auto-import `domains/` or `shared/`: import them explicitly through the `@/` alias.

The `extension-info` domain is a working example: a service reads the manifest and detects the browser, and the popup only renders its components.

## Make it yours

- Set the extension name and permissions in the `manifest` option of `wxt.config.ts`.
- Update `name` and `description` in `package.json`.
- Replace the icons in `public/icon/` and the logo in `src/domains/extension-info/assets/logo.svg`.
- Adjust the theme colors declared with `@theme` in `src/shared/styles/tailwind.css`.
- Point the website link in `src/domains/extension-info/components/ExtensionMenu.vue` to your project.

## Contributing

Commits follow [Conventional Commits](https://www.conventionalcommits.org). On each commit, Husky runs lint-staged (ESLint and Prettier on staged files) and commitlint on the message.

Before opening a pull request, make sure `pnpm compile`, `pnpm lint`, `pnpm format:check` and `pnpm build` all pass.

Detailed coding guidelines (naming, Vue and Pinia, Tailwind, extension contexts) are in [`CLAUDE.md`](CLAUDE.md), written in French.

## Releasing

```bash
GITHUB_TOKEN=<your-token> pnpm release
```

release-it bumps the version in `package.json`, updates `CHANGELOG.md` from the commit history, builds the Chrome and Firefox zips, creates a `vX.Y.Z` tag and publishes a GitHub release with the zips attached. Nothing is published to npm.
