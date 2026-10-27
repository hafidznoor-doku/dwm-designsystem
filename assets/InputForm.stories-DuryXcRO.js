import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{t}from"./react-DlPsW1c0.js";import{t as n}from"./jsx-runtime-MKhVqBIO.js";import{At as r,Bt as i,Ft as a,Gt as o,Ht as s,It as c,Jt as l,Kt as u,Lt as d,Mt as f,Nt as p,Ot as m,Pt as h,Rt as g,Ut as _,Vt as v,Wt as y,Xt as b,Yt as x,jt as S,kt as C,qt as w,zt as T}from"./iframe-MwzDaa_q.js";import{n as E,r as D,t as O}from"./controlStories-IBTfhR0X.js";function k(){let[e,t]=(0,A.useState)(``);return(0,j.jsx)(i,{label:`Catatan`,placeholder:`Masukkan Catatan`,maxLength:255,value:e,onChange:e=>t(e.target.value)})}var A,j,M,N,P,F,I,L,R,z,B,V,H,U,W,G,K,q,J,Y,X;function Z(){return(Z=e((()=>{A=t(),E(),b(),l(),S(),u(),_(),v(),T(),j=n(),M=(e=328)=>[t=>(0,j.jsx)(`div`,{style:{width:e},children:(0,j.jsx)(t,{})})],N={title:`Controls/Input Form`,component:g,args:{label:`Nomor Ponsel`,placeholder:`81234567901`,prefix:`+62`,helperText:`Contoh: 81234567901`,info:!0,clearable:!0,showCounter:!0,maxLength:255,disabled:!1,error:!1,state:`default`},argTypes:{state:{control:`inline-radio`,options:[`default`,`pressed`]},type:{control:`inline-radio`,options:[`text`,`tel`,`email`,`password`]},flag:{control:`select`,options:[void 0,`indonesia`,`malaysia`,`singapore`,`unitedStates`]},error:{control:`boolean`}},decorators:M(),parameters:{docs:{description:{component:'Underline form fields for DOKU e-Wallet: `TextField` (Figma `Input Form` base form), `SearchField` (search variant), `TextArea` (`Input Area`), `DateField` (`Input Date`), `PinInput` / `PasswordInput` (6-digit code and PIN dots) and `Flag`.\n\nFields are real inputs: the focused (Figma *pressed*) underline comes from focus, *filled* from the value, *invalid* from `error` (a string replaces the helper text) and *disabled* from `disabled`. `state="pressed"` only forces the focus look for docs. Labels are associated with their input, and the helper / counter are linked with `aria-describedby`. `type="password"` adds a show/hide toggle.\n\n**Design notes:**\n- The underline is a 0-height line in Elyx and does not appear in the Elyx renders; it is drawn here as a 1dp line (that is the whole diff on *pressed* states).\n- Invalid base form keeps the neutral underline and only turns the helper red-70; the search variant turns the box red. Select Form\'s error helper is red-80.\n- Disabled label is neutral-30 in Input Form but neutral-40 in Input Area and Input Date.\n- The `search` variant uses off-palette greys (#4D4D4D, #666, #CCC, #B3B3B3, #EAECF0) and a 20dp line height; base form uses tokens and 16dp.\n- The counter reads 0/255 in the *filled* designs; the coded counter counts the real value.\n- Input Date\'s placeholder in the design is a phone number ("81234567901"); use a date hint such as "Pilih tanggal".\n- Empty PIN cells are 28×20 dp, filled ones 28×28, so the row grows when the first digit lands. Filled password dots and the active-cell highlight are not in the design (neutral-80 / red-20 used).'}},elyxSpec:e=>({file:f.file,scene:d(e),live:(0,j.jsx)(g,{...e,style:{width:317}})})}},P={},F={name:`Phone number + contacts`,args:{label:`Nomor Ponsel`,type:`tel`,onContactClick:()=>alert(`Buka kontak`),helperText:void 0,showCounter:!1}},I={args:{flag:`indonesia`,prefix:`+62`,clearable:!1,helperText:void 0,showCounter:!1}},L={args:{label:`Kata Sandi`,type:`password`,prefix:void 0,placeholder:`Masukkan kata sandi`,clearable:!1,showCounter:!1,info:!1,helperText:`Minimal 8 karakter`}},R={args:{defaultValue:`8123`,error:`Nomor ponsel tidak valid`}},z={args:{defaultValue:`81234567901`,disabled:!0}},B={render:()=>(0,j.jsx)(s,{label:`Cari Merchant`,placeholder:`Nama merchant`,helperText:`Minimal 3 huruf`,onSearch:e=>console.log(`search`,e)}),parameters:{elyxSpec:()=>({file:f.file,scene:a({}),live:(0,j.jsx)(s,{label:`Cari Merchant`,placeholder:`Nama merchant`,style:{width:317}})})}},V={name:`Input Area`,render:()=>(0,j.jsx)(k,{}),parameters:{elyxSpec:()=>({file:f.file,scene:c({}),live:(0,j.jsx)(i,{label:`Catatan`,placeholder:`Masukkan Catatan`,maxLength:255,style:{width:328}})})}},H={name:`Input Date`,render:()=>(0,j.jsx)(x,{label:`Tanggal Lahir`,info:!0,onChange:e=>console.log(`date`,e)}),parameters:{elyxSpec:()=>({file:f.file,scene:m({}),live:(0,j.jsx)(x,{label:`Tanggal Lahir`,style:{width:317}})})}},U={name:`PIN input`,render:()=>(0,j.jsx)(o,{onComplete:e=>console.log(`code`,e)}),parameters:{elyxSpec:()=>({file:f.file,scene:h(),live:(0,j.jsx)(o,{})})}},W={name:`PIN input – wrong code`,render:()=>(0,j.jsx)(o,{defaultValue:`111111`,error:!0})},G={name:`Password input`,render:()=>(0,j.jsx)(y,{onComplete:e=>console.log(`pin`,e)}),parameters:{elyxSpec:()=>({file:f.file,scene:p(),live:(0,j.jsx)(y,{})})}},K=[`indonesia`,`malaysia`,`singapore`,`unitedStates`],q={render:()=>(0,j.jsx)(`div`,{style:{display:`flex`,gap:16},children:K.map(e=>(0,j.jsx)(w,{country:e,size:32,label:e},e))}),parameters:{elyxSpec:()=>({file:f.file,scene:C(`indonesia`),live:(0,j.jsx)(w,{country:`indonesia`})})}},J={...D(f,r),decorators:[]},Y={...O(f,r),decorators:[]},X=[`Playground`,`PhoneWithContacts`,`CountryPicker`,`Password`,`Invalid`,`Disabled`,`Search`,`InputArea`,`InputDate`,`Pin`,`PinError`,`PasswordDots`,`Flags`,`AllVariants`,`ElyxVariant`],P.parameters={...P.parameters,docs:{...P.parameters?.docs,source:{originalSource:`{}`,...P.parameters?.docs?.source}}},F.parameters={...F.parameters,docs:{...F.parameters?.docs,source:{originalSource:`{
  name: "Phone number + contacts",
  args: {
    label: "Nomor Ponsel",
    type: "tel",
    onContactClick: () => alert("Buka kontak"),
    helperText: undefined,
    showCounter: false
  }
}`,...F.parameters?.docs?.source}}},I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
  args: {
    flag: "indonesia",
    prefix: "+62",
    clearable: false,
    helperText: undefined,
    showCounter: false
  }
}`,...I.parameters?.docs?.source}}},L.parameters={...L.parameters,docs:{...L.parameters?.docs,source:{originalSource:`{
  args: {
    label: "Kata Sandi",
    type: "password",
    prefix: undefined,
    placeholder: "Masukkan kata sandi",
    clearable: false,
    showCounter: false,
    info: false,
    helperText: "Minimal 8 karakter"
  }
}`,...L.parameters?.docs?.source}}},R.parameters={...R.parameters,docs:{...R.parameters?.docs,source:{originalSource:`{
  args: {
    defaultValue: "8123",
    error: "Nomor ponsel tidak valid"
  }
}`,...R.parameters?.docs?.source}}},z.parameters={...z.parameters,docs:{...z.parameters?.docs,source:{originalSource:`{
  args: {
    defaultValue: "81234567901",
    disabled: true
  }
}`,...z.parameters?.docs?.source}}},B.parameters={...B.parameters,docs:{...B.parameters?.docs,source:{originalSource:`{
  render: () => <SearchField label="Cari Merchant" placeholder="Nama merchant" helperText="Minimal 3 huruf" onSearch={v => console.log("search", v)} />,
  parameters: {
    elyxSpec: () => ({
      file: inputFormScene.file,
      scene: searchFieldExport({}),
      live: <SearchField label="Cari Merchant" placeholder="Nama merchant" style={{
        width: 317
      }} />
    })
  }
}`,...B.parameters?.docs?.source}}},V.parameters={...V.parameters,docs:{...V.parameters?.docs,source:{originalSource:`{
  name: "Input Area",
  render: () => <AreaDemo />,
  parameters: {
    elyxSpec: () => ({
      file: inputFormScene.file,
      scene: textAreaExport({}),
      live: <TextArea label="Catatan" placeholder="Masukkan Catatan" maxLength={255} style={{
        width: 328
      }} />
    })
  }
}`,...V.parameters?.docs?.source}}},H.parameters={...H.parameters,docs:{...H.parameters?.docs,source:{originalSource:`{
  name: "Input Date",
  render: () => <DateField label="Tanggal Lahir" info onChange={d => console.log("date", d)} />,
  parameters: {
    elyxSpec: () => ({
      file: inputFormScene.file,
      scene: dateFieldExport({}),
      live: <DateField label="Tanggal Lahir" style={{
        width: 317
      }} />
    })
  }
}`,...H.parameters?.docs?.source}}},U.parameters={...U.parameters,docs:{...U.parameters?.docs,source:{originalSource:`{
  name: "PIN input",
  render: () => <PinInput onComplete={c => console.log("code", c)} />,
  parameters: {
    elyxSpec: () => ({
      file: inputFormScene.file,
      scene: pinInputExport(),
      live: <PinInput />
    })
  }
}`,...U.parameters?.docs?.source}}},W.parameters={...W.parameters,docs:{...W.parameters?.docs,source:{originalSource:`{
  name: "PIN input – wrong code",
  render: () => <PinInput defaultValue="111111" error />
}`,...W.parameters?.docs?.source}}},G.parameters={...G.parameters,docs:{...G.parameters?.docs,source:{originalSource:`{
  name: "Password input",
  render: () => <PasswordInput onComplete={c => console.log("pin", c)} />,
  parameters: {
    elyxSpec: () => ({
      file: inputFormScene.file,
      scene: passwordInputExport(),
      live: <PasswordInput />
    })
  }
}`,...G.parameters?.docs?.source}}},q.parameters={...q.parameters,docs:{...q.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: "flex",
    gap: 16
  }}>{countries.map(c => <Flag key={c} country={c} size={32} label={c} />)}</div>,
  parameters: {
    elyxSpec: () => ({
      file: inputFormScene.file,
      scene: flagExport("indonesia"),
      live: <Flag country="indonesia" />
    })
  }
}`,...q.parameters?.docs?.source}}},J.parameters={...J.parameters,docs:{...J.parameters?.docs,source:{originalSource:`{
  ...(matrixStory(inputFormScene, fromElyx) as Story),
  decorators: []
}`,...J.parameters?.docs?.source}}},Y.parameters={...Y.parameters,docs:{...Y.parameters?.docs,source:{originalSource:`{
  ...(elyxVariantStory(inputFormScene, fromElyx) as Story),
  decorators: []
}`,...Y.parameters?.docs?.source}}}})))()}Z();export{J as AllVariants,I as CountryPicker,z as Disabled,Y as ElyxVariant,q as Flags,V as InputArea,H as InputDate,R as Invalid,L as Password,G as PasswordDots,F as PhoneWithContacts,U as Pin,W as PinError,P as Playground,B as Search,X as __namedExportsOrder,N as default};