import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{t}from"./react-DlPsW1c0.js";import{t as n}from"./jsx-runtime-MKhVqBIO.js";import{C as r,S as i,T as a,b as o,v as s,w as c,x as l,y as u}from"./iframe-MwzDaa_q.js";import{n as d,r as f,t as p}from"./controlStories-IBTfhR0X.js";var m,h,g,_,v,y,b,x,S,C,w;function T(){return(T=e((()=>{m=t(),d(),a(),u(),h=n(),g={title:`Controls/Toggle`,component:r,args:{defaultChecked:!1,disabled:!1,"aria-label":`Smart Login`},argTypes:{checked:{control:`boolean`,description:`Controlled value. Leave unset for an uncontrolled toggle.`},defaultChecked:{control:`boolean`},disabled:{control:`boolean`}},parameters:{docs:{description:{component:'On/off switch for settings that take effect immediately (e.g. Smart Login). It is a native checkbox with `role="switch"`: click or Space toggles it, and it works controlled (`checked` + `onChange`) or uncontrolled (`defaultChecked`). Use `ToggleListItem` for a settings row; the whole row is the label.\n\n**Design notes:** the switch is 37.78 × 20 dp in the component, but instances in `blocks/account` are resized to 38 × 20. The thumb shadow flips direction between off (3, 3) and on (−4, 3), and disabled toggles have no shadow. The `_toggle-list` label and icon use an off-palette grey, rgb(77 77 77), instead of a neutral token.'}},elyxSpec:e=>({file:i.file,scene:o(e),live:(0,h.jsx)(r,{...e})})}},_={},v={args:{defaultChecked:!0}},y={render:()=>(0,h.jsxs)(`div`,{style:{display:`flex`,gap:16},children:[(0,h.jsx)(r,{disabled:!0,"aria-label":`Nonaktif`}),(0,h.jsx)(r,{disabled:!0,defaultChecked:!0,"aria-label":`Nonaktif aktif`})]})},b={render:function(){let[e,t]=(0,m.useState)(!0);return(0,h.jsxs)(`div`,{style:{display:`flex`,gap:12,alignItems:`center`,fontFamily:`var(--doku-font-brand)`},children:[(0,h.jsx)(r,{checked:e,onChange:t,"aria-label":`Notifikasi`}),(0,h.jsxs)(`span`,{children:[`Notifikasi `,e?`aktif`:`nonaktif`]})]})}},x={name:`Toggle list item`,render:()=>(0,h.jsx)(c,{label:`Smart Login`,icon:`dw-icon-akun-smart-login-outline`,defaultChecked:!0,style:{width:344}}),parameters:{elyxSpec:()=>({file:i.file,scene:l(),live:(0,h.jsx)(c,{label:`Smart Login`,icon:`dw-icon-akun-smart-login-outline`,defaultChecked:!0,style:{width:344}})})}},S=f(i,s),C=p(i,s),w=[`Playground`,`On`,`Disabled`,`Controlled`,`ListItem`,`AllVariants`,`ElyxVariant`],_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  args: {
    defaultChecked: true
  }
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: "flex",
    gap: 16
  }}>
      <Toggle disabled aria-label="Nonaktif" />
      <Toggle disabled defaultChecked aria-label="Nonaktif aktif" />
    </div>
}`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  render: function Render() {
    const [on, setOn] = useState(true);
    return <div style={{
      display: "flex",
      gap: 12,
      alignItems: "center",
      fontFamily: "var(--doku-font-brand)"
    }}>
        <Toggle checked={on} onChange={setOn} aria-label="Notifikasi" />
        <span>Notifikasi {on ? "aktif" : "nonaktif"}</span>
      </div>;
  }
}`,...b.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  name: "Toggle list item",
  render: () => <ToggleListItem label="Smart Login" icon="dw-icon-akun-smart-login-outline" defaultChecked style={{
    width: 344
  }} />,
  parameters: {
    elyxSpec: () => ({
      file: toggleScene.file,
      scene: toggleListExport(),
      live: <ToggleListItem label="Smart Login" icon="dw-icon-akun-smart-login-outline" defaultChecked style={{
        width: 344
      }} />
    })
  }
}`,...x.parameters?.docs?.source}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`matrixStory(toggleScene, fromElyx) as Story`,...S.parameters?.docs?.source}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`elyxVariantStory(toggleScene, fromElyx) as Story`,...C.parameters?.docs?.source}}}})))()}T();export{S as AllVariants,b as Controlled,y as Disabled,C as ElyxVariant,x as ListItem,v as On,_ as Playground,w as __namedExportsOrder,g as default};