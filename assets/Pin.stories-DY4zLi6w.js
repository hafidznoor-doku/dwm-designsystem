import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{t}from"./react-DlPsW1c0.js";import{t as n}from"./jsx-runtime-MKhVqBIO.js";import{Ct as r,Tt as i,at as a,ct as o,it as s,lt as c,ot as l,st as u,ut as d}from"./iframe-MwzDaa_q.js";import{n as f,r as p,t as m}from"./controlStories-IBTfhR0X.js";var h,g,_,v,y,b,x,S,C,w,T,E;function D(){return(D=e((()=>{h=t(),f(),i(),d(),a(),g=n(),_=`123456`,v={title:`Controls/PIN`,component:o,args:{mode:`authentication`,value:``,error:``,showBiometric:!0},argTypes:{mode:{control:`inline-radio`,options:[`authentication`,`transactional`]},value:{control:`text`,description:`Entered digits (controls the dots).`},error:{control:`text`},onChange:{action:`onChange`},onComplete:{action:`onComplete`},onForgot:{action:`onForgot`},onBack:{action:`onBack`},onBiometric:{action:`onBiometric`}},parameters:{docs:{description:{component:'PIN entry on brand red: header, six dots, optional error, *LUPA PIN?* and the PIN keypad (Controls/Keyboard, `tone="brand"`). `authentication` is the login screen (greeting, 16 dp dots); `transactional` confirms a payment (back button, 20 dp dots, full 360 × 755 screen). Use it controlled (`value` + `onChange`) or uncontrolled (`defaultValue`); `onComplete` fires when the last digit is entered. `PinDots` is exported on its own for custom layouts.\n\n**Design notes:** the Figma set is named by state (`default` / `filled` / `error`), not by fill count; only empty and all-filled dots are drawn, partial fills are implied. Authentication dots are one 216 dp SVG while transactional dots are six 20 dp frames. The keypad sits 9 dp from the left in `transactional default/filled` and 8 dp in `transactional error`; the coded screen centres it (8.5 dp). On error the dots go back to empty, so the error variant also clears the value.'}},elyxSpec:e=>({file:u.file,scene:l(e),live:(0,g.jsx)(o,{...e})})}},y={render:function(e){let[t,n]=(0,h.useState)(e.value??``),[r,i]=(0,h.useState)(e.value);return r!==e.value&&(i(e.value),n(e.value??``)),(0,g.jsx)(o,{...e,value:t,onChange:t=>{n(t),e.onChange?.(t)},error:t?void 0:e.error||void 0})}},b={render:function(e){let[t,n]=(0,h.useState)(``),[r,i]=(0,h.useState)(),[a,s]=(0,h.useState)(!1);return(0,g.jsxs)(`div`,{style:{display:`grid`,gap:12,justifyItems:`center`},children:[(0,g.jsx)(o,{...e,value:t,error:r,onChange:e=>{n(e),i(void 0),s(!1)},onComplete:e=>{e===_?s(!0):(i(`PIN salah. Silakan coba lagi`),n(``))}}),(0,g.jsx)(`small`,{children:a?`PIN benar ✓`:`Coba ${_}`})]})},parameters:{controls:{include:[`mode`]}}},x={args:{mode:`transactional`,value:`123`}},S={args:{error:`PIN salah. Silakan coba lagi`}},C={name:`PIN dots + Keyboard`,render:function(){let[e,t]=(0,h.useState)(``);return(0,g.jsxs)(`div`,{style:{width:343,display:`grid`,gap:24},children:[(0,g.jsx)(`div`,{style:{background:`var(--elyx-colors-red-50)`,padding:`24px 0`,borderRadius:12},children:(0,g.jsx)(c,{filled:e.length})}),(0,g.jsx)(r,{layout:`pin`,tone:`light`,showBiometric:!1,onKey:e=>t(t=>e===`backspace`?t.slice(0,-1):/^\d$/.test(e)&&t.length<6?t+e:t)}),(0,g.jsx)(`small`,{style:{textAlign:`center`},children:e.length===6?`PIN lengkap`:`${e.length} / 6`})]})},parameters:{controls:{disable:!0},elyxSpec:void 0}},w=p(u,s),T=m(u,s),E=[`Playground`,`LoginFlow`,`Transactional`,`Error`,`DotsWithKeyboard`,`AllVariants`,`ElyxVariant`],y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  render: function Render(args) {
    const [value, setValue] = useState(args.value ?? "");
    const [shown, setShown] = useState(args.value);
    if (shown !== args.value) {
      setShown(args.value);
      setValue(args.value ?? "");
    }
    return <Pin {...args} value={value} onChange={v => {
      setValue(v);
      args.onChange?.(v);
    }} error={value ? undefined : args.error || undefined} />;
  }
}`,...y.parameters?.docs?.source},description:{story:"Controlled by the `value` / `error` controls; the keypad still types.",...y.parameters?.docs?.description}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  render: function Render(args) {
    const [value, setValue] = useState("");
    const [error, setError] = useState<string>();
    const [ok, setOk] = useState(false);
    return <div style={{
      display: "grid",
      gap: 12,
      justifyItems: "center"
    }}>
        <Pin {...args} value={value} error={error} onChange={v => {
        setValue(v);
        setError(undefined);
        setOk(false);
      }} onComplete={v => {
        if (v === DEMO_PIN) setOk(true);else {
          setError("PIN salah. Silakan coba lagi");
          setValue("");
        }
      }} />
        <small>{ok ? "PIN benar ✓" : \`Coba \${DEMO_PIN}\`}</small>
      </div>;
  },
  parameters: {
    controls: {
      include: ["mode"]
    }
  }
}`,...b.parameters?.docs?.source},description:{story:`Type 123456 to succeed; any other PIN shows the error and clears the dots.`,...b.parameters?.docs?.description}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  args: {
    mode: "transactional",
    value: "123"
  }
}`,...x.parameters?.docs?.source}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  args: {
    error: "PIN salah. Silakan coba lagi"
  }
}`,...S.parameters?.docs?.source}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  name: "PIN dots + Keyboard",
  render: function Render() {
    const [pin, setPin] = useState("");
    const onKey = (k: KeyboardKey) => setPin(p => k === "backspace" ? p.slice(0, -1) : /^\\d$/.test(k) && p.length < 6 ? p + k : p);
    return <div style={{
      width: 343,
      display: "grid",
      gap: 24
    }}>
        <div style={{
        background: "var(--elyx-colors-red-50)",
        padding: "24px 0",
        borderRadius: 12
      }}>
          <PinDots filled={pin.length} />
        </div>
        <Keyboard layout="pin" tone="light" showBiometric={false} onKey={onKey} />
        <small style={{
        textAlign: "center"
      }}>{pin.length === 6 ? "PIN lengkap" : \`\${pin.length} / 6\`}</small>
      </div>;
  },
  parameters: {
    controls: {
      disable: true
    },
    elyxSpec: undefined
  }
}`,...C.parameters?.docs?.source},description:{story:"`PinDots` wired to a standalone light `Keyboard`: the keypad's `onKey` drives the dots.",...C.parameters?.docs?.description}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`matrixStory(pinScene, fromElyx) as Story`,...w.parameters?.docs?.source}}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`elyxVariantStory(pinScene, fromElyx) as Story`,...T.parameters?.docs?.source}}}})))()}D();export{w as AllVariants,C as DotsWithKeyboard,T as ElyxVariant,S as Error,b as LoginFlow,y as Playground,x as Transactional,E as __namedExportsOrder,v as default};