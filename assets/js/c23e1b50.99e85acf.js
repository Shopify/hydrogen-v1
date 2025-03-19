"use strict";(self.webpackChunkdocs_v_1=self.webpackChunkdocs_v_1||[]).push([[2614],{1418:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>s,contentTitle:()=>i,default:()=>d,frontMatter:()=>o,metadata:()=>l,toc:()=>p});var r=n(8168),a=(n(6540),n(5680));const o={},i="useNavigate",l={unversionedId:"hooks/framework/usenavigate",id:"hooks/framework/usenavigate",title:"useNavigate",description:"The useNavigate hook imperatively navigates between routes.",source:"@site/docs/hooks/framework/usenavigate.md",sourceDirName:"hooks/framework",slug:"/hooks/framework/usenavigate",permalink:"/hydrogen-v1/hooks/framework/usenavigate",draft:!1,tags:[],version:"current",frontMatter:{},sidebar:"hydrogen",previous:{title:"useFlashSession",permalink:"/hydrogen-v1/hooks/framework/useflashsession"},next:{title:"useRequestContext",permalink:"/hydrogen-v1/hooks/framework/userequestcontext"}},s={},p=[{value:"Example code",id:"example-code",level:2},{value:"Return value",id:"return-value",level:2},{value:"Considerations",id:"considerations",level:2},{value:"Related components",id:"related-components",level:2},{value:"Related framework topics",id:"related-framework-topics",level:2}],u={toc:p},c="wrapper";function d(e){let{components:t,...n}=e;return(0,a.yg)(c,(0,r.A)({},u,n,{components:t,mdxType:"MDXLayout"}),(0,a.yg)("h1",{id:"usenavigate"},"useNavigate"),(0,a.yg)("p",null,"The ",(0,a.yg)("inlineCode",{parentName:"p"},"useNavigate")," hook imperatively navigates between routes."),(0,a.yg)("h2",{id:"example-code"},"Example code"),(0,a.yg)("pre",null,(0,a.yg)("code",{parentName:"pre",className:"language-jsx",metastring:'title="component.client.jsx"',title:'"component.client.jsx"'},"import {useNavigate} from '@shopify/hydrogen';\n\nfunction addToCart() {}\n\nexport default function ClientComponent() {\n  const navigate = useNavigate();\n  async function clickAddToCart() {\n    await addToCart();\n    navigate('/success', {replace: true});\n  }\n  return <Button onClick={clickAddToCart}>Add to Cart</Button>;\n}\n")),(0,a.yg)("h2",{id:"return-value"},"Return value"),(0,a.yg)("p",null,"The ",(0,a.yg)("inlineCode",{parentName:"p"},"useNavigate")," hook returns a function which accepts the following values:"),(0,a.yg)("table",null,(0,a.yg)("thead",{parentName:"table"},(0,a.yg)("tr",{parentName:"thead"},(0,a.yg)("th",{parentName:"tr",align:null},"Name"),(0,a.yg)("th",{parentName:"tr",align:null},"Description"))),(0,a.yg)("tbody",{parentName:"table"},(0,a.yg)("tr",{parentName:"tbody"},(0,a.yg)("td",{parentName:"tr",align:null},"path"),(0,a.yg)("td",{parentName:"tr",align:null},"The path you want to navigate to.")),(0,a.yg)("tr",{parentName:"tbody"},(0,a.yg)("td",{parentName:"tr",align:null},"options"),(0,a.yg)("td",{parentName:"tr",align:null},"The options for the configuration object: ",(0,a.yg)("inlineCode",{parentName:"td"},"replace"),", ",(0,a.yg)("inlineCode",{parentName:"td"},"reloadDocument"),", ",(0,a.yg)("inlineCode",{parentName:"td"},"clientState"),", ",(0,a.yg)("inlineCode",{parentName:"td"},"scroll"),". For more information on the options, refer to the ",(0,a.yg)("a",{parentName:"td",href:"/components/framework/link/"},"Link component"),".")))),(0,a.yg)("h2",{id:"considerations"},"Considerations"),(0,a.yg)("ul",null,(0,a.yg)("li",{parentName:"ul"},"Consider using the ",(0,a.yg)("inlineCode",{parentName:"li"},"useNavigate")," hook only where appropriate. Generally, you should use the ",(0,a.yg)("a",{parentName:"li",href:"/components/framework/link/"},(0,a.yg)("inlineCode",{parentName:"a"},"Link"))," component instead, because it provides standard browser accessibility functionality, like ",(0,a.yg)("inlineCode",{parentName:"li"},"cmd+click")," and right-click to open."),(0,a.yg)("li",{parentName:"ul"},"The ",(0,a.yg)("inlineCode",{parentName:"li"},"useNavigate")," hook is only available in client components.")),(0,a.yg)("h2",{id:"related-components"},"Related components"),(0,a.yg)("ul",null,(0,a.yg)("li",{parentName:"ul"},(0,a.yg)("a",{parentName:"li",href:"/components/framework/link/"},(0,a.yg)("inlineCode",{parentName:"a"},"Link")))),(0,a.yg)("h2",{id:"related-framework-topics"},"Related framework topics"),(0,a.yg)("ul",null,(0,a.yg)("li",{parentName:"ul"},(0,a.yg)("a",{parentName:"li",href:"https://shopify.dev/custom-storefronts/hydrogen/routing"},"Routes"))))}d.isMDXComponent=!0},5680:(e,t,n)=>{n.d(t,{xA:()=>u,yg:()=>g});var r=n(6540);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},o=Object.keys(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var s=r.createContext({}),p=function(e){var t=r.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},u=function(e){var t=p(e.components);return r.createElement(s.Provider,{value:t},e.children)},c="mdxType",d={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},m=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,o=e.originalType,s=e.parentName,u=l(e,["components","mdxType","originalType","parentName"]),c=p(n),m=a,g=c["".concat(s,".").concat(m)]||c[m]||d[m]||o;return n?r.createElement(g,i(i({ref:t},u),{},{components:n})):r.createElement(g,i({ref:t},u))}));function g(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=n.length,i=new Array(o);i[0]=m;var l={};for(var s in t)hasOwnProperty.call(t,s)&&(l[s]=t[s]);l.originalType=e,l[c]="string"==typeof e?e:a,i[1]=l;for(var p=2;p<o;p++)i[p]=n[p];return r.createElement.apply(null,i)}return r.createElement.apply(null,n)}m.displayName="MDXCreateElement"}}]);