import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{t}from"./react-DlPsW1c0.js";import{t as n}from"./jsx-runtime-MKhVqBIO.js";import{cn as r,dn as i,fn as a,hn as o,ln as s,mn as c,pn as l,sn as u,un as d}from"./iframe-MwzDaa_q.js";import{n as f,r as p,t as m}from"./controlStories-IBTfhR0X.js";var h,g,_,v,y,b,x,S,C,w;function T(){return(T=e((()=>{h=t(),f(),o(),r(),l(),g=n(),_=[{value:`scan`,label:`QRIS`,icon:`pan-tool-outlined`},{value:`card`,label:`Kartu`,icon:`payment-outlined`}],v={title:`Controls/Pill`,component:c,args:{label:`QRIS`,icon:`payment-outlined`,size:`medium`,appearance:`pill`,selected:!1,disabled:!1},argTypes:{size:{control:`inline-radio`,options:[`large`,`medium`]},appearance:{control:`inline-radio`,options:[`pill`,`filter`]},icon:{control:`select`,options:[void 0,`payment-outlined`,`pan-tool-outlined`]}},parameters:{docs:{description:{component:'Selectable chip, the building block of `PillTabs` (`appearance="pill"`, red when selected) and `Filter` (`appearance="filter"`, grey when selected). On its own it is a toggle button with `aria-pressed`; inside those groups it gets tab / radio roles. `PillSwitch` (Figma `switch`) is the compact two-way mode switch from the same page.\n\n**Design notes:**\n- Size names don\'t line up between sets: `_pill` is 32 (Large) / 28 (Medium), `_filter-pill` is 40 (Large) / 32 (Medium), so a Medium filter pill is as tall as a Large tab pill.\n- Filter pills use an off-palette grey, rgb(204 204 204), for unselected text and icons.\n- `_filter-pill` has no disabled state; the coded one greys the text with `neutral-30` like `_pill`.\n- In `switch`, the selected segment has a 10 dp gap between icon and label, the unselected one 4 dp, so segments change width when selected.'}},elyxSpec:e=>({file:d.file,scene:s(e),live:(0,g.jsx)(c,{...e})})}},y={render:function(e){let[t,n]=(0,h.useState)(e.selected);return(0,g.jsx)(c,{...e,selected:t,onClick:()=>n(!t)})}},b={args:{appearance:`filter`,size:`large`,selected:!0,icon:void 0,label:`Semua`}},x={render:()=>(0,g.jsx)(a,{options:_,defaultValue:`scan`,"aria-label":`Metode bayar`}),parameters:{elyxSpec:()=>({file:d.file,scene:i(),live:(0,g.jsx)(a,{options:_,defaultValue:`scan`})})}},S=p(d,u),C=m(d,u),w=[`Playground`,`Filter`,`Switch`,`AllVariants`,`ElyxVariant`],y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  render: function Render(args) {
    const [on, setOn] = useState(args.selected);
    return <Pill {...args} selected={on} onClick={() => setOn(!on)} />;
  }
}`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  args: {
    appearance: "filter",
    size: "large",
    selected: true,
    icon: undefined,
    label: "Semua"
  }
}`,...b.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  render: () => <PillSwitch options={switchOptions} defaultValue="scan" aria-label="Metode bayar" />,
  parameters: {
    elyxSpec: () => ({
      file: pillScene.file,
      scene: pillSwitchExport(),
      live: <PillSwitch options={switchOptions} defaultValue="scan" />
    })
  }
}`,...x.parameters?.docs?.source}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`matrixStory(pillScene, fromElyx) as Story`,...S.parameters?.docs?.source}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`elyxVariantStory(pillScene, fromElyx) as Story`,...C.parameters?.docs?.source}}}})))()}T();export{S as AllVariants,C as ElyxVariant,b as Filter,y as Playground,x as Switch,w as __namedExportsOrder,v as default};