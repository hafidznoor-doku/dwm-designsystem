# Figma → Elyx import

Regenerates `controls/`, `blocks/`, `screens/`, and `resources/assets/` from the
Figma file "Mobile Currency" (`Design System/Mobile Currency.fig`).

```sh
cd tools/figma-import && npm install
mkdir -p /tmp/mc && unzip -o "<path>/Mobile Currency.fig" -d /tmp/mc
rm -rf ../../controls ../../blocks ../../screens ../../resources/assets
node --max-old-space-size=8000 convert.mjs /tmp/mc/canvas.fig /tmp/mc/images ../..
```

Needs Node 23.8+ (built-in zstd). Then normalize each file and run diagnostics.

- `pages.json` — which Figma page goes to which file (`"screens"` = one file per frame).
- `palette.json` — hex → `colors` token map used to bind component colors.
- Tokens (`tokens/*.elyx`) and `foundations.elyx` are hand-maintained, not generated.

How it converts: instances are resolved with their overrides, component props,
instance swaps, and slots; auto layout becomes Elyx stacks; vector-only layers
become SVGs in `resources/assets/icons` (single-color ones tinted via `fill`);
instances of library components become Elyx instances with property overrides;
Figma slots become `slot: .true` frames with `insert(...)` overrides. Local
text styles in the file have drifted from the layers, so text keeps each
layer's own font values.
