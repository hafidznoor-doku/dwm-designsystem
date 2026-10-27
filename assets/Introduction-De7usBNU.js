import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{t}from"./jsx-runtime-MKhVqBIO.js";import{i as n,r}from"./react-DITjJg24.js";import{a as i,o as a}from"./blocks-Bh4UTf_i.js";function o(e){let t={code:`code`,em:`em`,h1:`h1`,h2:`h2`,li:`li`,p:`p`,pre:`pre`,strong:`strong`,ul:`ul`,...n(),...e.components};return(0,c.jsxs)(c.Fragment,{children:[(0,c.jsx)(i,{title:`Introduction`}),`
`,(0,c.jsx)(t.h1,{id:`doku-e-wallet-design-system`,children:`DOKU e-Wallet design system`}),`
`,(0,c.jsxs)(t.p,{children:[`Live components and implementation specs for the DOKU e-Wallet mobile app (Android and iOS),
generated from the Elyx design project in this repository. The `,(0,c.jsx)(t.code,{children:`.elyx`}),` files are the source of
truth. Everything here is rebuilt from them.`]}),`
`,(0,c.jsx)(t.h2,{id:`whats-here`,children:`What's here`}),`
`,(0,c.jsxs)(t.ul,{children:[`
`,(0,c.jsxs)(t.li,{children:[(0,c.jsx)(t.strong,{children:`Foundations`}),`: color, typography, spacing and radius tokens with their Android resource and iOS constant names, the icon set, and ready-to-use `,(0,c.jsx)(t.code,{children:`colors.xml`}),`, `,(0,c.jsx)(t.code,{children:`dimens.xml`}),` and `,(0,c.jsx)(t.code,{children:`DokuTokens.swift`}),`.`]}),`
`,(0,c.jsxs)(t.li,{children:[(0,c.jsx)(t.strong,{children:`Controls`}),`: hand-coded, interactive components (Button, Toggle, Input, PIN, Keyboard…). Use the `,(0,c.jsx)(t.strong,{children:`Controls`}),` panel to switch size, variant and state.`]}),`
`,(0,c.jsxs)(t.li,{children:[(0,c.jsx)(t.strong,{children:`Blocks`}),` and `,(0,c.jsx)(t.strong,{children:`Screens`}),`: built live from the Elyx layers. Wherever a design uses a control instance, the coded control is rendered in its place.`]}),`
`]}),`
`,(0,c.jsx)(t.h2,{id:`reading-the-spec`,children:`Reading the spec`}),`
`,(0,c.jsxs)(t.p,{children:[`Every story has a `,(0,c.jsx)(t.strong,{children:`Spec`}),` under the live component. Hide it with the ruler (`,(0,c.jsx)(t.strong,{children:`Spec`}),`) button in the toolbar. It follows the variant you pick in Controls:`]}),`
`,(0,c.jsxs)(t.p,{children:[`| Section | What it gives you |
| --- | --- |
| Anatomy | Numbered layers with size and position. Hover a row to outline the layer and its padding. |
| Layout & spacing | Stack direction, padding, gap, radius and alignment, with the spacing/radius token when one matches. |
| Colors | Every fill, text color, icon tint and border with its token, hex, Android name and iOS name. Values with no token are marked `,(0,c.jsx)(t.em,{children:`off-palette`}),`. |
| Typography | Font, weight, size (sp/pt) and absolute line height for each text style. |
| Platform skeletons | Jetpack Compose and SwiftUI outlines with the values filled in. Use them as a guide to structure, not as drop-in code. |
| Design reference | The Elyx render next to the live component, with the pixel diff from the last visual check. |`]}),`
`,(0,c.jsxs)(t.p,{children:[(0,c.jsx)(t.strong,{children:`Units:`}),` 1 Elyx px = 1 dp on Android = 1 pt on iOS. Font sizes are sp/pt. Screens are designed at 360–390 dp wide.`]}),`
`,(0,c.jsxs)(t.p,{children:[(0,c.jsx)(t.strong,{children:`Borders:`}),` Elyx strokes are drawn inside the layer unless the spec says `,(0,c.jsx)(t.em,{children:`outside`}),`, so they never add to the layer's size.`]}),`
`,(0,c.jsx)(t.h2,{id:`keeping-it-in-sync`,children:`Keeping it in sync`}),`
`,(0,c.jsx)(t.pre,{children:(0,c.jsx)(t.code,{className:`language-sh`,children:`cd storybook
npm run storybook     # export tokens + scenes + renders, then start Storybook
npm run sync:all      # rebuild everything after changing tokens or a shared component
npm run check:visual  # pixel-diff every live story against its Elyx render (server must be running)
`})})]})}function s(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,c.jsx)(t,{...e,children:(0,c.jsx)(o,{...e})}):o(e)}var c;function l(){return(l=e((()=>{c=t(),r(),a()})))()}l();export{s as default};