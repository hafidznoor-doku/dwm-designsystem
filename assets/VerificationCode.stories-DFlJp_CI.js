import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{t}from"./react-DlPsW1c0.js";import{t as n}from"./jsx-runtime-MKhVqBIO.js";import{c as r,d as i,f as a,h as o,l as s,m as c,p as l,s as u,u as d}from"./iframe-MwzDaa_q.js";import{n as f,r as p,t as m}from"./controlStories-IBTfhR0X.js";var h,g,_,v,y,b,x,S,C,w,T,E,D,O;function k(){return(k=e((()=>{h=t(),f(),c(),r(),a(),g=n(),_=`123456`,v={sms:`08123****898`,whatsapp:`08123****898`,email:`user@mail.com`},y={title:`Controls/VerificationCode`,component:l,args:{channel:`sms`,destination:`08123****898`,value:``,status:`default`,countdown:120,chancesLeft:2},argTypes:{channel:{control:`inline-radio`,options:[`sms`,`whatsapp`,`email`]},status:{control:`inline-radio`,options:[`default`,`wrong`,`expired`]},countdown:{control:{type:`number`,min:0,step:1}},chancesLeft:{control:{type:`number`,min:0,max:3,step:1}},onChange:{action:`onChange`},onComplete:{action:`onComplete`},onResend:{action:`onResend`},onSwitchChannel:{action:`onSwitchChannel`},onContactSupport:{action:`onContactSupport`}},decorators:[e=>(0,g.jsx)(`div`,{style:{width:360,background:`var(--elyx-colors-neutral-00)`,padding:`24px 0`},children:(0,g.jsx)(e,{})})],parameters:{docs:{description:{component:'One-time code entry after a code was sent by SMS, WhatsApp or e-mail. The cells are one real `<input inputMode="numeric" autocomplete="one-time-code">` (Controls/InputForm `PinInput`), so typing, paste and SMS autofill all work; non-digits are dropped and each digit lands in its own cell. `status="wrong"` / `"expired"` turn the cells red and show the message; `countdown` (seconds, see `useCountdown`) shows *Kirim ulang dalam mm:ss* and, at 0, the *Kirim Ulang* action. SMS and WhatsApp offer each other as fallback; e-mail offers *Hubungi Customer Care*. `VerificationChanceInfo` (`_verification-chance-info`) and `VerificationScreen` (`_template-verif-code`) are exported too.\n\n**Design notes:** empty cells are 28 × 20 dp but filled ones 28 × 28 dp, so the row grows by 8 dp on the first digit. Filled cells override the fill/border to off-palette #F0F0F0 / #ECECEC (rendered here with `neutral-10` / `neutral-20`). The subtitle box (341 dp) is wider than its 328 dp column. *Kirim Ulang* is drawn in body colour, indistinguishable from the text around it. Expired variants still say *Sisa 2 kesempatan* regardless of the wrong-attempt count. The template\'s keyboard is the Android mock-up stretched to 375 dp.'}},elyxSpec:e=>({file:d.file,scene:s(e),live:(0,g.jsx)(l,{...e})})}},b={render:function(e){let[t,n]=(0,h.useState)(e.value??``),[r,i]=(0,h.useState)(e.value);return r!==e.value&&(i(e.value),n(e.value??``)),(0,g.jsx)(l,{...e,value:t,onChange:t=>{n(t),e.onChange?.(t)}})}},x={render:function(e){let t=e.channel??`sms`,[n,r]=(0,h.useState)(``),[i,a]=(0,h.useState)(`default`),[s,c]=(0,h.useState)(2),[u,d]=(0,h.useState)(!1),{left:f,restart:p}=o(30);return(0,g.jsxs)(`div`,{style:{display:`grid`,gap:16,justifyItems:`center`},children:[(0,g.jsx)(l,{channel:t,destination:v[t],value:n,status:f===0&&i==="default"&&!u?`expired`:i,countdown:f,chancesLeft:s,autoFocus:!0,onChange:e=>{r(e),a(`default`),d(!1)},onComplete:e=>{e===_?d(!0):(a(`wrong`),c(e=>Math.max(0,e-1)))},onResend:()=>{r(``),a(`default`),c(e=>Math.max(0,e-1)),p()}}),(0,g.jsx)(`small`,{children:u?`Kode benar ✓`:`Kode demo: ${_}`})]})},parameters:{controls:{include:[`channel`]}}},S={args:{value:`111111`,status:`wrong`,chancesLeft:1}},C={args:{channel:`whatsapp`,value:`111111`,status:`expired`,countdown:0}},w={args:{channel:`email`,destination:`user@mail.com`}},T={render:function(){let[e,t]=(0,h.useState)(``);return(0,g.jsx)(i,{code:{channel:`sms`,destination:`08123****898`,value:e,onChange:t}})},decorators:[],parameters:{controls:{disable:!0},elyxSpec:void 0}},E={...p(d,u),decorators:[]},D={...m(d,u),decorators:[]},O=[`Playground`,`Flow`,`Wrong`,`Expired`,`Email`,`Screen`,`AllVariants`,`ElyxVariant`],b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  render: function Render(args) {
    const [value, setValue] = useState(args.value ?? "");
    const [shown, setShown] = useState(args.value);
    if (shown !== args.value) {
      setShown(args.value);
      setValue(args.value ?? "");
    }
    return <VerificationCode {...args} value={value} onChange={v => {
      setValue(v);
      args.onChange?.(v);
    }} />;
  }
}`,...b.parameters?.docs?.source},description:{story:"Typing works; `value` / `status` controls reset it.",...b.parameters?.docs?.description}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  render: function Render(args) {
    const channel = args.channel ?? "sms";
    const [value, setValue] = useState("");
    const [status, setStatus] = useState<VerificationStatus>("default");
    const [chances, setChances] = useState(2);
    const [ok, setOk] = useState(false);
    const {
      left,
      restart
    } = useCountdown(30);
    return <div style={{
      display: "grid",
      gap: 16,
      justifyItems: "center"
    }}>
        <VerificationCode channel={channel} destination={DESTINATION[channel]} value={value} status={left === 0 && status === "default" && !ok ? "expired" : status} countdown={left} chancesLeft={chances} autoFocus onChange={v => {
        setValue(v);
        setStatus("default");
        setOk(false);
      }} onComplete={v => {
        if (v === DEMO_CODE) setOk(true);else {
          setStatus("wrong");
          setChances(c => Math.max(0, c - 1));
        }
      }} onResend={() => {
        setValue("");
        setStatus("default");
        setChances(c => Math.max(0, c - 1));
        restart();
      }} />
        <small>{ok ? "Kode benar ✓" : \`Kode demo: \${DEMO_CODE}\`}</small>
      </div>;
  },
  parameters: {
    controls: {
      include: ["channel"]
    }
  }
}`,...x.parameters?.docs?.source},description:{story:`Live flow: a running countdown, 3 attempts; 123456 is the right code.`,...x.parameters?.docs?.description}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  args: {
    value: "111111",
    status: "wrong",
    chancesLeft: 1
  }
}`,...S.parameters?.docs?.source}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  args: {
    channel: "whatsapp",
    value: "111111",
    status: "expired",
    countdown: 0
  }
}`,...C.parameters?.docs?.source}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  args: {
    channel: "email",
    destination: "user@mail.com"
  }
}`,...w.parameters?.docs?.source}}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  render: function Render() {
    const [value, setValue] = useState("");
    return <VerificationScreen code={{
      channel: "sms",
      destination: "08123****898",
      value,
      onChange: setValue
    }} />;
  },
  decorators: [],
  parameters: {
    controls: {
      disable: true
    },
    elyxSpec: undefined
  }
}`,...T.parameters?.docs?.source},description:{story:"`_template-verif-code`: the code block on a full screen; the mock keyboard types into it.",...T.parameters?.docs?.description}}},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  ...(matrixStory(verificationScene, fromElyx) as Story),
  decorators: []
}`,...E.parameters?.docs?.source}}},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  ...(elyxVariantStory(verificationScene, fromElyx) as Story),
  decorators: []
}`,...D.parameters?.docs?.source}}}})))()}k();export{E as AllVariants,D as ElyxVariant,w as Email,C as Expired,x as Flow,b as Playground,T as Screen,S as Wrong,O as __namedExportsOrder,y as default};