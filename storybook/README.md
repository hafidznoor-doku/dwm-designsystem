# Storybook

Live components and developer specs for the DOKU e-Wallet design system,
built from the Elyx project one folder up. The `.elyx` files are the source of
truth. Storybook is the reference for Android and iOS developers.

```sh
cd storybook
npm install
npm run storybook        # sync from Elyx, then open http://localhost:6006
```

| Command | What it does |
| --- | --- |
| `npm run sync` | Export tokens, scenes and design renders for `.elyx` files changed since the last run. |
| `npm run sync:all` | Rebuild everything. Do this after editing tokens or a shared component, since only the edited file itself counts as changed. |
| `npm run check:visual [controls/button]` | With the server running, pixel-diff every live story (or one path) against its Elyx render. Results show in each Spec; diff images go to `visual-report/`. |
| `npm run typecheck` | TypeScript check. |
| `npm run build-storybook` | Static site in `storybook-static/` for sharing. |

Needs the Elyx app (`/Applications/Elyx Preview.app`, or `ELYX_BIN`), Google
Chrome for the visual check (or `CHROME_BIN`), and DIN Next LT Pro installed
locally. `resources/fonts/` is empty; without the font, text falls back to Inter.

## How it fits together

```
tokens/*.elyx ──export-tokens──▶ src/generated/tokens.css, tokens.json, platform/{colors.xml, dimens.xml, DokuTokens.swift}
*.elyx exports ─export-scenes──▶ src/generated/scenes/**.json  (elyx tree + elyx css, joined per layer)
                                 stories/generated/**          (blocks, screens, Elyx boards)
               ─build-catalog──▶ public/renders/**.png          (Elyx renders: design reference + visual check)
```

- **Controls** (`src/components/<Name>/`) are hand-coded React components:
  - `<Name>.tsx` plus `<Name>.module.css`, using token variables only.
  - `<Name>.elyx.tsx` maps an Elyx node and its variant to the component.
  - `<Name>.stories.tsx` holds the stories.

  `src/components/registry.tsx` loads every `*.elyx.tsx`. Blocks and screens then render the coded control wherever the design uses an instance of it.
- **Blocks and screens** are rendered live from the scene JSON by `src/elyx/Scene.tsx`, with real text, CSS and SVG icons. They are not screenshots.
- **Spec** (`src/docs/SpecSheet.tsx`) appears under every story: anatomy, layout and spacing, color tokens with Android/iOS names, typography, Compose/SwiftUI skeletons, and the Elyx reference. All of it is read from the scene JSON, so it always matches the design.

## Adding or changing a control

1. Change the design in Elyx. Keep each export's `title:` in the Figma form `<set> / Prop=value, …`, because stories and the spec rely on it.
2. `npm run sync`.
3. Update the control's CSS/props and `fromElyx` mapping if the variant set changed.
4. `npm run check:visual controls/<file>`. Aim for under 2% diff and a size within 1 dp.

`src/generated/`, `stories/generated/`, `public/renders/` and `visual-report/` are generated and git-ignored.
