import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{t}from"./react-DlPsW1c0.js";import{t as n}from"./jsx-runtime-MKhVqBIO.js";import{an as r,gt as i,ht as a,mt as o,on as s,pt as c}from"./iframe-MwzDaa_q.js";import{n as l,r as u,t as d}from"./controlStories-IBTfhR0X.js";var f,p,m,h,g,_,v,y,b;function x(){return(x=e((()=>{f=t(),l(),s(),o(),p=n(),m={title:`Controls/PillTabs`,component:r,args:{options:[`Semua`,`Masuk`,`Keluar`],size:`medium`,"aria-label":`Riwayat`},argTypes:{size:{control:`inline-radio`,options:[`medium`,`large`]},value:{control:`text`,description:`Controlled selection. Leave unset for an uncontrolled group.`},defaultValue:{control:`text`}},parameters:{docs:{description:{component:'Pill-shaped tabs that switch the content below them (2–5 tabs). Single selection with `role="tablist"`; click or ←/→ moves the selection. `options` takes plain labels or `{ value, label, icon, disabled }`. Works controlled (`value` + `onChange`) or uncontrolled (`defaultValue`, else the first tab).\n\n**Design notes:** the Figma set only varies the tab count (2–5), always Medium (28 dp) pills with 16 dp gaps and the first tab selected. The tab icon layer exists but is hidden in every variant.'}},elyxSpec:e=>({file:i.file,scene:a(e),live:(0,p.jsx)(r,{...e})})}},h={},g={render:function(e){let[t,n]=(0,f.useState)(`masuk`),i=[{value:`semua`,label:`Semua`},{value:`masuk`,label:`Masuk`},{value:`keluar`,label:`Keluar`},{value:`pending`,label:`Pending`,disabled:!0}];return(0,p.jsxs)(`div`,{style:{display:`grid`,gap:12,fontFamily:`var(--doku-font-brand)`},children:[(0,p.jsx)(r,{...e,options:i,value:t,onChange:n}),(0,p.jsxs)(`span`,{children:[`Tab aktif: `,t]})]})}},_={args:{options:[{value:`qris`,label:`QRIS`,icon:`pan-tool-outlined`},{value:`kartu`,label:`Kartu`,icon:`payment-outlined`}]}},v=u(i,c),y=d(i,c),b=[`Playground`,`Controlled`,`WithIcons`,`AllVariants`,`ElyxVariant`],h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  render: function Render(args) {
    const [tab, setTab] = useState("masuk");
    const options = [{
      value: "semua",
      label: "Semua"
    }, {
      value: "masuk",
      label: "Masuk"
    }, {
      value: "keluar",
      label: "Keluar"
    }, {
      value: "pending",
      label: "Pending",
      disabled: true
    }];
    return <div style={{
      display: "grid",
      gap: 12,
      fontFamily: "var(--doku-font-brand)"
    }}>
        <PillTabs {...args} options={options} value={tab} onChange={setTab} />
        <span>Tab aktif: {tab}</span>
      </div>;
  }
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  args: {
    options: [{
      value: "qris",
      label: "QRIS",
      icon: "pan-tool-outlined"
    }, {
      value: "kartu",
      label: "Kartu",
      icon: "payment-outlined"
    }]
  }
}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`matrixStory(pillTabsScene, fromElyx) as Story`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`elyxVariantStory(pillTabsScene, fromElyx) as Story`,...y.parameters?.docs?.source}}}})))()}x();export{v as AllVariants,g as Controlled,y as ElyxVariant,h as Playground,_ as WithIcons,b as __namedExportsOrder,m as default};