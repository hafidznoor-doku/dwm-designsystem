# Project context

This is an Elyx design project. `.elyx` files contain the designs, and
`elyx.json` contains project settings.

## About this project

The DOKU e-Wallet (DWM) mobile design system, converted from the Figma file
"Mobile Currency" (`Design System/Mobile Currency.fig`). It is used to ideate
mobile screens and flows for DOKU e-Wallet Indonesia. UI copy is in Bahasa
Indonesia; screens are 360–390px wide.

Where to start:

- `foundations.elyx` — the color palette and type scale at a glance.
- `tokens/colors.elyx` — `colors` (primitive ramps: red, neutral, green,
  yellow, cyan, blue, purple, pink; steps 05–100) and `semantic` (brand,
  foreground, background, border, status roles). `colors.red-50` (#E1251B) is
  the DOKU brand red.
- `tokens/typography.elyx`, `tokens/lengths.elyx` — type scale, spacing, radius.
- `controls/` and `blocks/` — one file per Figma component page. Every Figma
  variant is an exported component named `<set><variant values>`, e.g.
  `buttonDefaultPrimaryDefault`; its `title:` keeps the original Figma name
  (`button / Size=default, variant=primary, :state=default`).
- `screens/` — screen templates from the Figma Status Payment, Confirmation
  Page, and General Error pages.

Conventions:

- Components are set in DIN Next LT Pro (Regular/Medium/Bold), installed
  locally. The newer Figma typography guideline moves to Inter at the same scale.
- Colors in components reference `colorTokens.colors.*`; raw hex only appears
  where the Figma source used an off-palette color.
- Icons and illustrations are SVGs in `resources/assets/icons/`; single-color
  icons are drawn in black and tinted with `fill`. Bitmaps live in
  `resources/assets/images/`.
- Components that contain other library components use real instances
  (`frame : buttonLib.buttonDefaultPrimaryDefault { … }`), so build new
  screens the same way: import the component file and override text, colors,
  and `display` on the instance instead of redrawing it.
- Hidden Figma layers (optional icons, alternate states) are kept with
  `display: .none`; toggle them on an instance to show them.

## Structure

A sensible structure to follow when creating components is to place them in directories like these:
    controls/
    blocks/
    screens/
    flows/
    resources/
        assets/
        fonts/

- 'controls' contains buttons, toggles, text fields, and other small interface elements.
- 'resources/assets' contains images and icons, and 'resources/fonts' contains fonts.
- 'blocks' contains larger reusable pieces such as dialogs, popovers, navigation bars, and panels.
- 'screens' contains the complete windows or pages that make up the product.
- 'flows' brings screens together to explain a journey or product behavior.

## Working in this project

- Follow the patterns in existing `.elyx` files.
- Preserve the project's established design language and conventions.
- Keep this file current as the project evolves.
