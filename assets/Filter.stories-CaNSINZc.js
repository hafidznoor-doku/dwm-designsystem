import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{t}from"./react-DlPsW1c0.js";import{t as n}from"./jsx-runtime-MKhVqBIO.js";import{$t as r,en as i,in as a,nn as o,rn as s,tn as c}from"./iframe-MwzDaa_q.js";import{n as l,r as u,t as d}from"./controlStories-IBTfhR0X.js";var f,p,m,h,g,_,v,y,b;function x(){return(x=e((()=>{f=t(),l(),a(),o(),p=n(),m={title:`Controls/Filter`,component:s,args:{options:[`Semua`,`Top Up`,`Transfer`,`Pembayaran`,`Tarik Tunai`,`Refund`],size:`large`,"aria-label":`Filter transaksi`},argTypes:{size:{control:`inline-radio`,options:[`large`,`medium`]},value:{control:`text`,description:`Controlled selection. Leave unset for an uncontrolled filter.`},defaultValue:{control:`text`}},decorators:[e=>(0,p.jsx)(`div`,{style:{width:360,background:`var(--elyx-colors-neutral-00)`,padding:`12px 0`},children:(0,p.jsx)(e,{})})],parameters:{docs:{description:{component:'Screen-wide row of filter pills with 16 dp side insets; pills past the edge scroll horizontally. Single choice (`role="radiogroup"`, ←/→ move the selection). `options` takes plain labels or `{ value, label, icon, disabled }`. `large` pills are 40 dp, `medium` 32 dp.\n\n**Design notes:** the Figma frame is 390 dp wide with six 58 dp pills, so the last ~1.5 pills overflow to 444 dp; Elyx draws the overflow unclipped, while the coded row scrolls (clips at its width), which is how it behaves on a phone. The visual check therefore compares a 390 dp box against a 444 dp render and reports a large diff on both exports. Large pills are fully round (radius 32); Medium ones use radius 16.'}},elyxSpec:e=>({file:i.file,scene:r(e),live:(0,p.jsx)(s,{...e})})}},h={},g={args:{size:`medium`}},_={render:function(e){let[t,n]=(0,f.useState)(`Transfer`);return(0,p.jsxs)(`div`,{style:{display:`grid`,gap:12,fontFamily:`var(--doku-font-brand)`},children:[(0,p.jsx)(s,{...e,value:t,onChange:n}),(0,p.jsxs)(`span`,{style:{padding:`0 16px`},children:[`Filter: `,t]})]})}},v=u(i,c),y=d(i,c),b=[`Playground`,`Medium`,`Controlled`,`AllVariants`,`ElyxVariant`],h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  args: {
    size: "medium"
  }
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  render: function Render(args) {
    const [value, setValue] = useState("Transfer");
    return <div style={{
      display: "grid",
      gap: 12,
      fontFamily: "var(--doku-font-brand)"
    }}>
        <Filter {...args} value={value} onChange={setValue} />
        <span style={{
        padding: "0 16px"
      }}>Filter: {value}</span>
      </div>;
  }
}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`matrixStory(filterScene, fromElyx) as Story`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`elyxVariantStory(filterScene, fromElyx) as Story`,...y.parameters?.docs?.source}}}})))()}x();export{v as AllVariants,_ as Controlled,y as ElyxVariant,g as Medium,h as Playground,b as __namedExportsOrder,m as default};