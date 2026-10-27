import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{t}from"./react-DlPsW1c0.js";import{t as n}from"./jsx-runtime-MKhVqBIO.js";import{Ct as r,St as i,Tt as a,bt as o,wt as s,xt as c,yt as l}from"./iframe-MwzDaa_q.js";import{n as u,r as d,t as f}from"./controlStories-IBTfhR0X.js";function p(e){let[t,n]=(0,m.useState)(``),i=t=>{e.onKey?.(t),n(e=>t===`backspace`?e.slice(0,-1):/^[0-9.,-]$/.test(t)?e+t:t===`space`?e+` `:e)};return(0,h.jsxs)(`div`,{style:{display:`grid`,gap:12,justifyItems:`start`},children:[(0,h.jsx)(`output`,{style:{font:`500 20px var(--doku-font-brand)`,minHeight:28},children:t||`—`}),(0,h.jsx)(r,{...e,onKey:i})]})}var m,h,g,_,v,y,b,x,S,C,w;function T(){return(T=e((()=>{m=t(),u(),a(),o(),h=n(),g={title:`Controls/Keyboard`,component:r,args:{layout:`pin`,tone:`light`,showBiometric:!1,systemBar:!0,disabled:!1},argTypes:{layout:{control:`inline-radio`,options:[`pin`,`android`,`ios`]},tone:{control:`inline-radio`,options:[`light`,`brand`],if:{arg:`layout`,eq:`pin`}},onKey:{action:`onKey`}},render:e=>(0,h.jsx)(p,{...e}),parameters:{docs:{description:{component:'Numeric keypad. Every key is a `<button>` that calls `onKey(key)` with `"0"`–`"9"`, `"backspace"`, `"biometric"` and, on the native mock-ups, `"," "." "-" "space" "done"`. Use `layout="pin"` for PIN entry (with `tone="brand"` on the red PIN screen, see Controls/PIN); `android` and `ios` only mock the OS keyboard for screen ideation — real apps get those from the platform.\n\n`KeyboardItem` is the 52 dp calculator key (`_keyboard-item`), `KeyboardOperationIcon` the 28 dp backspace glyph (`_keyboard-icon-operation`).\n\n**Design notes:** the light `input PIN` keypad carries a Face ID icon tinted `neutral-00` on a white key, so it is invisible; `showBiometric` makes it explicit. PIN keypad digits use off-palette #333333 and the backspace glyph #4D4D4D. No pressed state is drawn for the PIN keypad (a one-step darker key is used). `_keyboard-item` has two `pressed=true, number` variants (20 px / 28 line and 22 px / auto line). The iOS mock-up overflows its 291 dp frame by ~12 dp (the native layer is 302.6 dp), which offsets its visual check.'}},elyxSpec:e=>({file:i.file,scene:c(e),live:(0,h.jsx)(r,{...e})})}},_={},v={args:{tone:`brand`,showBiometric:!0},decorators:[e=>(0,h.jsx)(`div`,{style:{background:`var(--elyx-colors-red-50)`,color:`var(--elyx-colors-neutral-00)`,padding:16},children:(0,h.jsx)(e,{})})]},y={args:{layout:`android`}},b={name:`iOS`,args:{layout:`ios`}},x={render:()=>(0,h.jsxs)(`div`,{style:{display:`grid`,gridTemplateColumns:`repeat(4, 52px)`,gap:8},children:[[`7`,`8`,`9`].map(e=>(0,h.jsx)(s,{label:e},e)),(0,h.jsx)(s,{variant:`operator`,"aria-label":`Bagi`}),[`4`,`5`,`6`].map(e=>(0,h.jsx)(s,{label:e},e)),(0,h.jsx)(s,{variant:`operator`,pressed:!0,"aria-label":`Bagi`})]}),parameters:{controls:{disable:!0}}},S=d(i,l),C=f(i,l),w=[`Playground`,`PinBrand`,`Android`,`IOS`,`CalculatorKeys`,`AllVariants`,`ElyxVariant`],_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  args: {
    tone: "brand",
    showBiometric: true
  },
  decorators: [S => <div style={{
    background: "var(--elyx-colors-red-50)",
    color: "var(--elyx-colors-neutral-00)",
    padding: 16
  }}><S /></div>]
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  args: {
    layout: "android"
  }
}`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  name: "iOS",
  args: {
    layout: "ios"
  }
}`,...b.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: "grid",
    gridTemplateColumns: "repeat(4, 52px)",
    gap: 8
  }}>
      {["7", "8", "9"].map(d => <KeyboardItem key={d} label={d} />)}
      <KeyboardItem variant="operator" aria-label="Bagi" />
      {["4", "5", "6"].map(d => <KeyboardItem key={d} label={d} />)}
      <KeyboardItem variant="operator" pressed aria-label="Bagi" />
    </div>,
  parameters: {
    controls: {
      disable: true
    }
  }
}`,...x.parameters?.docs?.source}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`matrixStory(keyboardScene, fromElyx) as Story`,...S.parameters?.docs?.source}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`elyxVariantStory(keyboardScene, fromElyx) as Story`,...C.parameters?.docs?.source}}}})))()}T();export{S as AllVariants,y as Android,x as CalculatorKeys,C as ElyxVariant,b as IOS,v as PinBrand,_ as Playground,w as __namedExportsOrder,g as default};