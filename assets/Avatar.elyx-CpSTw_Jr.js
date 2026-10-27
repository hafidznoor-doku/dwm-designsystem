import{n as e,r as t}from"./rolldown-runtime-sJBDdmOt.js";import{n,r}from"./scenes-CzcjUeTB.js";import{t as i}from"./jsx-runtime-MKhVqBIO.js";var a,o,s,c;function l(){return(l=e((()=>{a=`controls/avatar.elyx`,o=`Controls`,s=[{ref:`avatarMale`,title:`Avatar / gender=male`,set:`Avatar`,props:{gender:`male`},root:{n:`avatarMale`,t:`frame`,spec:{w:38,h:38,wMode:`fixed`,hMode:`fixed`,x:0,y:0,radius:8,fills:[{type:`solid`,token:`colors.neutral-00`,value:`rgb(255 255 255 / 1)`,opacity:1}]},cls:`controls_avatar_avatarMale__avatarMale`,c:[{n:`ava14`,t:`rect`,spec:{w:41,h:41,wMode:`fixed`,hMode:`fixed`,x:-1,y:-1,fills:[{type:`image`,token:null,value:null,opacity:1,image:`resources/assets/images/fd6fba10aa466fb2.png`}]},cls:`controls_avatar_avatarMale__ava14`}]},css:`.controls_avatar_avatarMale__avatarMale {
  width: 38px;
  height: 38px;
  background: var(--elyx-colors-neutral-00, rgb(255 255 255 / 1));
  border-radius: 8px;
  position: relative;
  overflow: hidden;
}
.controls_avatar_avatarMale__ava14 {
  width: 41px;
  height: 41px;
  background-image: url("resources/assets/images/fd6fba10aa466fb2.png");
  background-size: 100% 100%;
  background-position: center;
  background-repeat: no-repeat;
  position: absolute;
  left: -1px;
  top: -1px;
}
.controls_avatar_avatarMale__avatarMale { position: relative; left: auto; top: auto; }
.controls_avatar_avatarMale__avatarMale, .controls_avatar_avatarMale__avatarMale * { box-sizing: border-box; }`},{ref:`avatarFemale`,title:`Avatar / gender=female`,set:`Avatar`,props:{gender:`female`},root:{n:`avatarFemale`,t:`frame`,spec:{w:38,h:38,wMode:`fixed`,hMode:`fixed`,x:86,y:0,radius:8,fills:[{type:`solid`,token:`colors.neutral-00`,value:`rgb(255 255 255 / 1)`,opacity:1}]},cls:`controls_avatar_avatarFemale__avatarFemale`,c:[{n:`ppIlustrasiIcon02`,t:`asset`,spec:{w:38,h:38,wMode:`fixed`,hMode:`fixed`,x:0,y:0},asset:{src:`resources/assets/icons/pp-ilustrasi-icon-02.svg`,tinted:!1},cls:`controls_avatar_avatarFemale__ppIlustrasiIcon02`}]},css:`.controls_avatar_avatarFemale__avatarFemale {
  width: 38px;
  height: 38px;
  background: var(--elyx-colors-neutral-00, rgb(255 255 255 / 1));
  border-radius: 8px;
  position: relative;
  overflow: hidden;
}
.controls_avatar_avatarFemale__ppIlustrasiIcon02 {
  width: 38px;
  height: 38px;
  position: absolute;
  left: 0px;
  top: 0px;
  background: url("resources/assets/icons/pp-ilustrasi-icon-02.svg") center / contain no-repeat;
}
.controls_avatar_avatarFemale__avatarFemale { position: relative; left: auto; top: auto; }
.controls_avatar_avatarFemale__avatarFemale, .controls_avatar_avatarFemale__avatarFemale * { box-sizing: border-box; }`}],c={file:a,section:o,exports:s}})))()}function u(e,t,n){let r={};for(let i of e.exports)(!n||n.includes(i.set))&&(r[`${e.file}#${i.ref}`]=e=>e===i.root||!d(e.spec,i.root.spec)?t(e,i.props??{},i):null);return r}function d(e,t){return p(e.fills)!==p(t.fills)||p(e.borders)!==p(t.borders)||JSON.stringify(e.radius)!==JSON.stringify(t.radius)||JSON.stringify(e.layout&&[e.layout.pad,e.layout.justify,e.layout.align,e.layout.gap])!==JSON.stringify(t.layout&&[t.layout.pad,t.layout.justify,t.layout.align,t.layout.gap])}function f(e,t){let n=e=>e.n===t?e:e.c?.map(n).find(Boolean),r=n(e);return r&&!r.hidden&&r.asset?r.asset.src.split(`/`).pop().replace(/\.svg$/,``):void 0}var p,m;function h(){return(h=e((()=>{p=e=>JSON.stringify((e??[]).map(e=>[e.type,e.token??e.value,e.width])),m=e=>e.trim().replace(/[\s_-]+(\w)/g,(e,t)=>t.toUpperCase())})))()}var g,_,v,y,b;function x(){return(x=e((()=>{g=`_avatar_qz2fe_3`,_=`_photo_qz2fe_19`,v=`_bitmap_qz2fe_22`,y=`_illustration_qz2fe_24`,b={avatar:g,photo:_,bitmap:v,illustration:y}})))()}function S({src:e,gender:t=`male`,alt:n,size:r=38,className:i,style:a,...o}){let s=w[t];return(0,C.jsx)(`span`,{...o,role:n?`img`:void 0,"aria-label":n,"aria-hidden":!n||void 0,className:[b.avatar,i].filter(Boolean).join(` `),style:{width:r,height:r,...a},children:(0,C.jsx)(`img`,{className:e?b.photo:s.cls,src:e??s.src,alt:``,draggable:!1})})}var C,w;function T(){return(T=e((()=>{x(),C=i(),w={male:{src:`resources/assets/images/fd6fba10aa466fb2.png`,cls:b.bitmap},female:{src:`resources/assets/icons/pp-ilustrasi-icon-02.svg`,cls:b.illustration}},S.__docgenInfo={description:"Profile picture in a rounded square. Elyx: controls/avatar.elyx, Figma set `Avatar`.",methods:[],displayName:`Avatar`,props:{src:{required:!1,tsType:{name:`string`},description:`User's profile photo. Without it the gender placeholder illustration is shown.`},gender:{required:!1,tsType:{name:`union`,raw:`"male" | "female"`,elements:[{name:`literal`,value:`"male"`},{name:`literal`,value:`"female"`}]},description:`Picks the placeholder illustration when there is no photo.`,defaultValue:{value:`"male"`,computed:!1}},alt:{required:!1,tsType:{name:`string`},description:`Accessible name, usually the user's name. Omit when the name is shown next to the avatar.`},size:{required:!1,tsType:{name:`number`},description:`Edge length in dp. The design uses 38.`,defaultValue:{value:`38`,computed:!1}}},composes:[`HTMLAttributes`]}})))()}var E=t({avatarExport:()=>k,avatarScene:()=>O,elyxInstances:()=>j,fromElyx:()=>A}),D,O,k,A,j;function M(){return(M=e((()=>{l(),h(),r(),T(),D=i(),O=c,k=e=>n(O,`Avatar`,{gender:e.gender??`male`}),A=(e,t)=>(0,D.jsx)(S,{gender:t.gender??`male`,size:Math.round(Math.min(e.spec.w,e.spec.h))}),j=u(O,A),A.__docgenInfo={description:``,methods:[],displayName:`fromElyx`}})))()}export{M as a,m as c,u as d,c as f,A as i,f as l,k as n,S as o,l as p,O as r,T as s,E as t,h as u};