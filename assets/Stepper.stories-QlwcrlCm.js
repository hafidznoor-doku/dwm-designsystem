import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{t}from"./react-DlPsW1c0.js";import{t as n}from"./jsx-runtime-MKhVqBIO.js";import{A as r,M as i,N as a,O as o,Un as s,Wn as c,j as l,k as u}from"./iframe-MwzDaa_q.js";import{n as d,r as f,t as p}from"./controlStories-IBTfhR0X.js";var m,h,g,_,v,y,b,x,S,C;function w(){return(w=e((()=>{m=t(),d(),c(),a(),u(),h=n(),g=e=>(0,h.jsx)(`div`,{style:{width:360},children:(0,h.jsx)(e,{})}),_={title:`Controls/Stepper`,component:i,args:{current:1,total:3,subtitle:`Buat PIN Kamu`},argTypes:{current:{control:{type:`range`,min:0,max:6,step:1}},total:{control:{type:`range`,min:2,max:6,step:1}}},decorators:[g],parameters:{docs:{description:{component:"Shows progress through a multi-step form (registration, PIN creation). Put it at the top of the screen under the app bar; `subtitle` names what the user does on the current step. Segments split the width evenly, so any `total` works.\n\n**Design notes:** in `Count step=Step 3` the second and third segments use `red-50` while the first uses `red-60` (Steps 1 and 2 use `red-60` throughout); the coded stepper uses `red-60` for every completed segment. The empty segment (#EAECF0) and subtitle (#4D4D4D) colors are off-palette. A hidden `currentStep` title (Bold 24) sits in the Figma layer but is never shown."}},elyxSpec:e=>({file:l.file,scene:r(e),live:(0,h.jsx)(i,{...e})})}},v={},y={args:{current:2,total:4,subtitle:`Verifikasi Identitas`}},b={render:e=>{let[t,n]=(0,m.useState)(1);return(0,h.jsxs)(`div`,{style:{display:`grid`,gap:16},children:[(0,h.jsx)(i,{...e,current:t}),(0,h.jsxs)(`div`,{style:{display:`flex`,gap:8,padding:`0 16px`},children:[(0,h.jsx)(s,{size:`small`,variant:`neutral`,label:`Kembali`,disabled:t<=1,onClick:()=>n(e=>e-1)}),(0,h.jsx)(s,{size:`small`,label:`Lanjut`,disabled:t>=(e.total??3),onClick:()=>n(e=>e+1)})]})]})}},x={...f(l,o),decorators:[]},S={...p(l,o),decorators:[]},C=[`Playground`,`FourSteps`,`Interactive`,`AllVariants`,`ElyxVariant`],v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  args: {
    current: 2,
    total: 4,
    subtitle: "Verifikasi Identitas"
  }
}`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  render: args => {
    const [step, setStep] = useState(1);
    return <div style={{
      display: "grid",
      gap: 16
    }}>
        <Stepper {...args} current={step} />
        <div style={{
        display: "flex",
        gap: 8,
        padding: "0 16px"
      }}>
          <Button size="small" variant="neutral" label="Kembali" disabled={step <= 1} onClick={() => setStep(s => s - 1)} />
          <Button size="small" label="Lanjut" disabled={step >= (args.total ?? 3)} onClick={() => setStep(s => s + 1)} />
        </div>
      </div>;
  }
}`,...b.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  ...(matrixStory(stepperScene, fromElyx) as Story),
  decorators: []
}`,...x.parameters?.docs?.source}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  ...(elyxVariantStory(stepperScene, fromElyx) as Story),
  decorators: []
}`,...S.parameters?.docs?.source}}}})))()}w();export{x as AllVariants,S as ElyxVariant,y as FourSteps,b as Interactive,v as Playground,C as __namedExportsOrder,_ as default};