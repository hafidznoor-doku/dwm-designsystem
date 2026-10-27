import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{t}from"./react-DlPsW1c0.js";import{t as n}from"./jsx-runtime-MKhVqBIO.js";import{Cn as r,Dn as i,En as a,On as o,Sn as s,Tn as c,bn as l,wn as u,xn as d}from"./iframe-MwzDaa_q.js";import{n as f,r as p,t as m}from"./controlStories-IBTfhR0X.js";var h,g,_,v,y,b,x,S,C,w,T,E,D,O;function k(){return(k=e((()=>{h=t(),f(),o(),c(),g=n(),_=[`20.000`,`50.000`,`75.000`,`100.000`,`150.000`,`200.000`,`300.000`,`500.000`,`750.000`].map(e=>({value:e})),v={wallet:_,pulsa:[[`20.000`,`21.500`],[`50.000`,`51.500`],[`75.000`,`76.000`],[`100.000`,`101.500`],[`150.000`,`151.500`],[`200.000`,`201.500`],[`300.000`,`301.500`],[`500.000`,`501.500`]].map(([e,t])=>({value:e,price:`Harga Rp ${t}`})),channel:l},y={wallet:358,pulsa:328,channel:342},b=e=>Object.values(v).includes(e.items)?v[e.layout??`wallet`]:e.items,x={title:`Controls/Denom`,component:a,args:{layout:`wallet`,value:`50.000`,items:_},argTypes:{layout:{control:`inline-radio`,options:[`wallet`,`pulsa`,`channel`]},value:{control:`text`},items:{control:!1},onChange:{action:`onChange`}},render:function(e){let t=e.layout??`wallet`,[n,r]=(0,h.useState)(e.value),[i,o]=(0,h.useState)(e.value);return i!==e.value&&(o(e.value),r(e.value)),(0,g.jsx)(`div`,{style:{width:y[t]},children:(0,g.jsx)(a,{...e,items:b(e),value:n,onChange:t=>{r(t),e.onChange?.(t)}})})},parameters:{docs:{description:{component:"Single-choice grid for top-up amounts (`wallet`: 3 columns; `pulsa`: 2 columns with price) and payment channels (`channel`: 2 columns of logos). It is a `radiogroup`; each `DenomOption` (`.denom-atom`) is a `radio` button, the chosen one gets a red-60 border. Columns share the container width.\n\n**Design notes:** the bare `.denom-atom` uses an off-palette #CCCCCC border (channel: #EAECF0), but every placement in `Denom` overrides it to `neutral-30` (channel: `neutral-20`) and removes the white fill; the coded options keep the white fill. Amount text is off-palette #4D4D4D. Only `nominal` has a `chosen` state; channel selection reuses it. In `wallet navigation` the GoPay option is a flattened SVG of a whole option instead of an instance, and one logo is a bitmap cropped inside its frame."}},elyxSpec:e=>({file:r.file,scene:d(e),live:(0,g.jsx)(a,{...e,items:b(e)})})}},S={},C={args:{layout:`pulsa`,value:`100.000`}},w={args:{layout:`channel`,value:`OVO`,label:`Pilih e-wallet`}},T={render:()=>(0,g.jsxs)(`div`,{style:{display:`flex`,gap:16},children:[(0,g.jsx)(i,{label:`15.000`,price:`Harga Rp 15.000`}),(0,g.jsx)(i,{label:`15.000`,price:`Harga Rp 15.000`,selected:!0}),(0,g.jsx)(i,{variant:`channel`,logo:`resources/assets/icons/emoney-gopay.svg`,logoLabel:`GoPay`})]}),parameters:{controls:{disable:!0},elyxSpec:()=>({file:r.file,scene:s({selected:!0}),live:(0,g.jsx)(i,{label:`15.000`,price:`Harga Rp 15.000`,selected:!0})})}},E=p(r,u),D=m(r,u),O=[`Playground`,`Pulsa`,`PaymentChannel`,`Option`,`AllVariants`,`ElyxVariant`],S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{}`,...S.parameters?.docs?.source}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  args: {
    layout: "pulsa",
    value: "100.000"
  }
}`,...C.parameters?.docs?.source}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  args: {
    layout: "channel",
    value: "OVO",
    label: "Pilih e-wallet"
  }
}`,...w.parameters?.docs?.source}}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: "flex",
    gap: 16
  }}>
      <DenomOption label="15.000" price="Harga Rp 15.000" />
      <DenomOption label="15.000" price="Harga Rp 15.000" selected />
      <DenomOption variant="channel" logo="resources/assets/icons/emoney-gopay.svg" logoLabel="GoPay" />
    </div>,
  parameters: {
    controls: {
      disable: true
    },
    elyxSpec: () => ({
      file: denomScene.file,
      scene: denomOptionExport({
        selected: true
      }),
      live: <DenomOption label="15.000" price="Harga Rp 15.000" selected />
    })
  }
}`,...T.parameters?.docs?.source}}},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`matrixStory(denomScene, fromElyx) as Story`,...E.parameters?.docs?.source}}},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`elyxVariantStory(denomScene, fromElyx) as Story`,...D.parameters?.docs?.source}}}})))()}k();export{E as AllVariants,D as ElyxVariant,T as Option,w as PaymentChannel,S as Playground,C as Pulsa,O as __namedExportsOrder,x as default};