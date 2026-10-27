import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{t}from"./react-DlPsW1c0.js";import{t as n}from"./jsx-runtime-MKhVqBIO.js";import{$ as r,Q as i,X as a,Y as o,Z as s,et as c,tt as l}from"./iframe-MwzDaa_q.js";import{n as u,r as d,t as f}from"./controlStories-IBTfhR0X.js";var p,m,h,g,_,v,y,b,x,S;function C(){return(C=e((()=>{p=t(),u(),l(),a(),m=n(),h={title:`Controls/Radio`,component:r,args:{label:`Laki-laki`,subtitle:`Pilih jika laki laki`,size:`large`,name:`playground`,value:`laki-laki`,defaultChecked:!1,disabled:!1},argTypes:{size:{control:`inline-radio`,options:[`large`,`small`]},checked:{control:`boolean`,description:`Controlled value. Leave unset for an uncontrolled radio.`},defaultChecked:{control:`boolean`},disabled:{control:`boolean`}},parameters:{docs:{description:{component:"Single choice from a short list. It is a native radio input: give options the same `name` and the browser handles single selection and arrow keys, or control it with `checked` + `onChange` (which receives the option's `value`). `RadioIndicator` is the bare circle (Figma `_master_checkbox`) for rows that handle selection themselves.\n\n**Design notes:**\n- *Radio Button large* uses its own 25 dp circle, while `_master_checkbox` large is 24 dp; small is 16 dp in both.\n- The large *default* state sets its label in DIN Medium 16 (43 dp tall); every other state uses Regular 14 (40 dp). The coded radio uses Regular 14 throughout so the label doesn't change when selected.\n- Small *default* and *checked* are fixed at 156.5 dp wide; small disabled ones hug at 126 dp.\n- Disabled states keep the label in `neutral-80`; only the circle greys out."}},elyxSpec:e=>({file:i.file,scene:s(e),live:(0,m.jsx)(r,{...e})})}},g={},_={render:function(){let[e,t]=(0,p.useState)(`laki-laki`);return(0,m.jsxs)(`div`,{role:`radiogroup`,"aria-label":`Jenis kelamin`,style:{display:`grid`,gap:16},children:[(0,m.jsx)(r,{name:`gender`,value:`laki-laki`,label:`Laki-laki`,subtitle:`Pilih jika laki laki`,checked:e===`laki-laki`,onChange:t}),(0,m.jsx)(r,{name:`gender`,value:`perempuan`,label:`Perempuan`,subtitle:`Pilih jika perempuan`,checked:e===`perempuan`,onChange:t}),(0,m.jsx)(r,{name:`gender`,value:`lainnya`,label:`Tidak disebutkan`,disabled:!0})]})}},v={args:{size:`small`,defaultChecked:!0}},y={render:()=>(0,m.jsx)(`div`,{style:{display:`flex`,gap:16,alignItems:`center`},children:[`large`,`medium`,`small`].map(e=>(0,m.jsxs)(`div`,{style:{display:`flex`,gap:8},children:[(0,m.jsx)(c,{size:e}),(0,m.jsx)(c,{size:e,checked:!0}),(0,m.jsx)(c,{size:e,checked:!0,disabled:!0}),(0,m.jsx)(c,{size:e,disabled:!0})]},e))})},b=d(i,o),x=f(i,o),S=[`Playground`,`Group`,`Small`,`Indicator`,`AllVariants`,`ElyxVariant`],g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  render: function Render() {
    const [value, setValue] = useState("laki-laki");
    return <div role="radiogroup" aria-label="Jenis kelamin" style={{
      display: "grid",
      gap: 16
    }}>
        <Radio name="gender" value="laki-laki" label="Laki-laki" subtitle="Pilih jika laki laki" checked={value === "laki-laki"} onChange={setValue} />
        <Radio name="gender" value="perempuan" label="Perempuan" subtitle="Pilih jika perempuan" checked={value === "perempuan"} onChange={setValue} />
        <Radio name="gender" value="lainnya" label="Tidak disebutkan" disabled />
      </div>;
  }
}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  args: {
    size: "small",
    defaultChecked: true
  }
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: "flex",
    gap: 16,
    alignItems: "center"
  }}>
      {(["large", "medium", "small"] as const).map(size => <div key={size} style={{
      display: "flex",
      gap: 8
    }}>
          <RadioIndicator size={size} />
          <RadioIndicator size={size} checked />
          <RadioIndicator size={size} checked disabled />
          <RadioIndicator size={size} disabled />
        </div>)}
    </div>
}`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`matrixStory(radioScene, fromElyx) as Story`,...b.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`elyxVariantStory(radioScene, fromElyx) as Story`,...x.parameters?.docs?.source}}}})))()}C();export{b as AllVariants,x as ElyxVariant,_ as Group,y as Indicator,g as Playground,v as Small,S as __namedExportsOrder,h as default};