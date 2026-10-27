import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{t}from"./react-DlPsW1c0.js";import{t as n}from"./jsx-runtime-MKhVqBIO.js";import{B as r,G as i,H as a,I as o,K as s,L as c,R as l,U as u,V as d,W as f,z as p}from"./iframe-MwzDaa_q.js";import{n as m,r as h,t as g}from"./controlStories-IBTfhR0X.js";function _(){let[e,t]=(0,v.useState)(`bri`);return(0,y.jsxs)(`div`,{children:[(0,y.jsx)(a,{label:`Bank Tujuan`,options:b,value:e,onChange:t}),(0,y.jsxs)(`p`,{style:{marginTop:32,fontSize:12},children:[`Terpilih: `,e??`-`]})]})}var v,y,b,x,S,C,w,T,E,D,O,k,A,j;function M(){return(M=e((()=>{v=t(),m(),s(),u(),l(),y=n(),b=[{value:`bca`,label:`BCA`},{value:`bni`,label:`BNI`},{value:`bri`,label:`BRI`},{value:`mandiri`,label:`Mandiri`},{value:`permata`,label:`Permata`,disabled:!0},{value:`cimb`,label:`CIMB Niaga`}],x={title:`Controls/Select Form`,component:a,args:{label:`Bank Tujuan`,placeholder:`Pilih bank`,options:b,helperText:`Pilih bank penerima`,info:!0,disabled:!1,error:!1,state:`default`},argTypes:{state:{control:`inline-radio`,options:[`default`,`pressed`]},error:{control:`boolean`},options:{control:!1}},decorators:[e=>(0,y.jsx)(`div`,{style:{width:328,minHeight:260},children:(0,y.jsx)(e,{})})],parameters:{docs:{description:{component:'Select field: an underline trigger (`role="combobox"`) that opens a `DropdownList` (`role="listbox"`) 52dp below its top, over the helper. Works controlled (`value` + `onChange`, `open` + `onOpenChange`) or uncontrolled (`defaultValue`, `defaultOpen`). Keyboard: ↓/↑/Enter/Space open, ↑/↓/Home/End move, Enter/Space select, Esc closes; tapping outside closes. Disabled options are skipped.\n\n**Design notes:**\n- Error helper is red-80 here but red-70 in Input Form; the error state does not change the underline.\n- The *pressed* chevron uses a 16×16 asset, the others 16×24 with the same glyph; the open list is hidden in the *pressed* export.\n- List options use off-palette greys (#4D4D4D text, #B3B3B3 disabled, #FAFAFA selected) and the standalone list border is #EAECF0 (≈ neutral-20, which the Select Form\'s own list uses).\n- The keyboard highlight (neutral-05) is not in the design; *presed* (sic) is the touch-down look.'}},elyxSpec:e=>({file:d.file,scene:r(e),live:(0,y.jsx)(a,{...e,style:{width:317}})})}},S={},C={args:{defaultOpen:!0,defaultValue:`bni`}},w={render:()=>(0,y.jsx)(_,{})},T={args:{error:`Bank wajib dipilih`}},E={args:{disabled:!0,defaultValue:`bca`}},D={name:`Dropdown List`,render:()=>(0,y.jsx)(f,{style:{width:205},options:b,value:`bni`,onSelect:e=>console.log(e)}),parameters:{elyxSpec:()=>({file:d.file,scene:o(5),live:(0,y.jsx)(f,{style:{width:205},options:b.slice(0,5)})})}},O={name:`List option`,render:()=>(0,y.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:8,alignItems:`flex-start`},children:[(0,y.jsx)(i,{hug:!0,label:`Dropdown menu`,iconStart:`bi-arrow-right-circle`,iconEnd:`bi-arrow-right-circle`}),(0,y.jsx)(i,{hug:!0,label:`Dropdown menu`,selected:!0}),(0,y.jsx)(i,{hug:!0,label:`Dropdown menu`,state:`pressed`}),(0,y.jsx)(i,{hug:!0,label:`Dropdown menu`,disabled:!0})]}),parameters:{elyxSpec:()=>({file:d.file,scene:p({}),live:(0,y.jsx)(i,{hug:!0,label:`Dropdown menu`})})}},k={...h(d,c),decorators:[]},A={...g(d,c),decorators:[]},j=[`Playground`,`Open`,`Controlled`,`Invalid`,`Disabled`,`List`,`Option`,`AllVariants`,`ElyxVariant`],S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{}`,...S.parameters?.docs?.source}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  args: {
    defaultOpen: true,
    defaultValue: "bni"
  }
}`,...C.parameters?.docs?.source}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  render: () => <ControlledDemo />
}`,...w.parameters?.docs?.source}}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  args: {
    error: "Bank wajib dipilih"
  }
}`,...T.parameters?.docs?.source}}},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  args: {
    disabled: true,
    defaultValue: "bca"
  }
}`,...E.parameters?.docs?.source}}},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  name: "Dropdown List",
  render: () => <DropdownList style={{
    width: 205
  }} options={banks} value="bni" onSelect={o => console.log(o)} />,
  parameters: {
    elyxSpec: () => ({
      file: selectFormScene.file,
      scene: dropdownListExport(5),
      live: <DropdownList style={{
        width: 205
      }} options={banks.slice(0, 5)} />
    })
  }
}`,...D.parameters?.docs?.source}}},O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  name: "List option",
  render: () => <div style={{
    display: "flex",
    flexDirection: "column",
    gap: 8,
    alignItems: "flex-start"
  }}>
      <ListOption hug label="Dropdown menu" iconStart="bi-arrow-right-circle" iconEnd="bi-arrow-right-circle" />
      <ListOption hug label="Dropdown menu" selected />
      <ListOption hug label="Dropdown menu" state="pressed" />
      <ListOption hug label="Dropdown menu" disabled />
    </div>,
  parameters: {
    elyxSpec: () => ({
      file: selectFormScene.file,
      scene: listOptionExport({}),
      live: <ListOption hug label="Dropdown menu" />
    })
  }
}`,...O.parameters?.docs?.source}}},k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  ...(matrixStory(selectFormScene, fromElyx) as Story),
  decorators: []
}`,...k.parameters?.docs?.source}}},A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
  ...(elyxVariantStory(selectFormScene, fromElyx) as Story),
  decorators: []
}`,...A.parameters?.docs?.source}}}})))()}M();export{k as AllVariants,w as Controlled,E as Disabled,A as ElyxVariant,T as Invalid,D as List,C as Open,O as Option,S as Playground,j as __namedExportsOrder,x as default};