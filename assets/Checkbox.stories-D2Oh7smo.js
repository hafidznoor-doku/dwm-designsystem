import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{t}from"./react-DlPsW1c0.js";import{t as n}from"./jsx-runtime-MKhVqBIO.js";import{Fn as r,In as i,Mn as a,Nn as o,Pn as s,jn as c}from"./iframe-MwzDaa_q.js";import{n as l,r as u,t as d}from"./controlStories-IBTfhR0X.js";var f,p,m,h,g,_,v,y,b,x,S;function C(){return(C=e((()=>{f=t(),l(),i(),s(),p=n(),m={title:`Controls/Checkbox`,component:r,args:{title:`Saya setuju dengan Syarat & Ketentuan`,subtitle:`Wajib dicentang untuk melanjutkan`,defaultChecked:!1,disabled:!1},argTypes:{checked:{control:`boolean`,description:`Controlled value. Leave unset for an uncontrolled checkbox.`},defaultChecked:{control:`boolean`},disabled:{control:`boolean`}},decorators:[e=>(0,p.jsx)(`div`,{style:{width:326},children:(0,p.jsx)(e,{})})],parameters:{docs:{description:{component:"Multi-select or consent option with a title and optional sub heading. It is a native checkbox, so clicking the text toggles it and Space works with focus. Works controlled (`checked` + `onChange`) or uncontrolled (`defaultChecked`).\n\n**Design notes:**\n- In the Elyx export the *Checked* box renders as an empty white square, and *Disabled checked* as a plain grey square: the two-tone Figma icon (box + check) was tinted with a single color, which hid the check mark. The coded checkbox follows the intended design instead: a brand red (`red-50`) box with a white check, grey (`neutral-40`) when disabled. Expect the visual diff to show the box on those two exports.\n- The *Default* state's title is set in Noto Sans 12/18 while every other state uses DIN Next 14/15.96, which makes Default 42 dp tall instead of 40. The coded checkbox uses DIN 14 for every state so the label doesn't jump when checked."}},elyxSpec:e=>({file:a.file,scene:c(e),live:(0,p.jsx)(r,{...e})})}},h={},g={args:{defaultChecked:!0}},_={args:{subtitle:void 0,title:`Ingat saya`}},v={render:e=>(0,p.jsxs)(`div`,{style:{display:`grid`,gap:16},children:[(0,p.jsx)(r,{...e,disabled:!0}),(0,p.jsx)(r,{...e,disabled:!0,defaultChecked:!0})]})},y={render:function(e){let[t,n]=(0,f.useState)(!1);return(0,p.jsx)(r,{...e,checked:t,onChange:n,subtitle:t?`Dicentang`:`Belum dicentang`})}},b=u(a,o),x=d(a,o),S=[`Playground`,`Checked`,`TitleOnly`,`Disabled`,`Controlled`,`AllVariants`,`ElyxVariant`],h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  args: {
    defaultChecked: true
  }
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  args: {
    subtitle: undefined,
    title: "Ingat saya"
  }
}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  render: args => <div style={{
    display: "grid",
    gap: 16
  }}>
      <Checkbox {...args} disabled />
      <Checkbox {...args} disabled defaultChecked />
    </div>
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  render: function Render(args) {
    const [on, setOn] = useState(false);
    return <Checkbox {...args} checked={on} onChange={setOn} subtitle={on ? "Dicentang" : "Belum dicentang"} />;
  }
}`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`matrixStory(checkboxScene, fromElyx) as Story`,...b.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`elyxVariantStory(checkboxScene, fromElyx) as Story`,...x.parameters?.docs?.source}}}})))()}C();export{b as AllVariants,g as Checked,y as Controlled,v as Disabled,x as ElyxVariant,h as Playground,_ as TitleOnly,S as __namedExportsOrder,m as default};