"use strict";(self.webpackChunkdocs_v_1=self.webpackChunkdocs_v_1||[]).push([[3689],{5680:(e,n,t)=>{t.d(n,{xA:()=>c,yg:()=>y});var o=t(6540);function r(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function s(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);n&&(o=o.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,o)}return t}function a(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?s(Object(t),!0).forEach((function(n){r(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):s(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function i(e,n){if(null==e)return{};var t,o,r=function(e,n){if(null==e)return{};var t,o,r={},s=Object.keys(e);for(o=0;o<s.length;o++)t=s[o],n.indexOf(t)>=0||(r[t]=e[t]);return r}(e,n);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(e);for(o=0;o<s.length;o++)t=s[o],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(r[t]=e[t])}return r}var l=o.createContext({}),p=function(e){var n=o.useContext(l),t=n;return e&&(t="function"==typeof e?e(n):a(a({},n),e)),t},c=function(e){var n=p(e.components);return o.createElement(l.Provider,{value:n},e.children)},u="mdxType",m={inlineCode:"code",wrapper:function(e){var n=e.children;return o.createElement(o.Fragment,{},n)}},d=o.forwardRef((function(e,n){var t=e.components,r=e.mdxType,s=e.originalType,l=e.parentName,c=i(e,["components","mdxType","originalType","parentName"]),u=p(t),d=r,y=u["".concat(l,".").concat(d)]||u[d]||m[d]||s;return t?o.createElement(y,a(a({ref:n},c),{},{components:t})):o.createElement(y,a({ref:n},c))}));function y(e,n){var t=arguments,r=n&&n.mdxType;if("string"==typeof e||r){var s=t.length,a=new Array(s);a[0]=d;var i={};for(var l in n)hasOwnProperty.call(n,l)&&(i[l]=n[l]);i.originalType=e,i[u]="string"==typeof e?e:r,a[1]=i;for(var p=2;p<s;p++)a[p]=t[p];return o.createElement.apply(null,a)}return o.createElement.apply(null,t)}d.displayName="MDXCreateElement"},5021:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>l,contentTitle:()=>a,default:()=>m,frontMatter:()=>s,metadata:()=>i,toc:()=>p});var o=t(8168),r=(t(6540),t(5680));const s={},a="useSession",i={unversionedId:"hooks/framework/usesession",id:"hooks/framework/usesession",title:"useSession",description:"The useSession hook reads session data in server components.",source:"@site/docs/hooks/framework/usesession.md",sourceDirName:"hooks/framework",slug:"/hooks/framework/usesession",permalink:"/hydrogen-v1/hooks/framework/usesession",draft:!1,tags:[],version:"current",frontMatter:{},sidebar:"hydrogen",previous:{title:"useRouteParams",permalink:"/hydrogen-v1/hooks/framework/userouteparams"},next:{title:"fetchSync",permalink:"/hydrogen-v1/hooks/global/fetchsync"}},l={},p=[{value:"Example code",id:"example-code",level:2},{value:"Return value",id:"return-value",level:2},{value:"Considerations",id:"considerations",level:2},{value:"Related components",id:"related-components",level:2},{value:"Related framework topics",id:"related-framework-topics",level:2}],c={toc:p},u="wrapper";function m(e){let{components:n,...t}=e;return(0,r.yg)(u,(0,o.A)({},c,t,{components:n,mdxType:"MDXLayout"}),(0,r.yg)("h1",{id:"usesession"},"useSession"),(0,r.yg)("p",null,"The ",(0,r.yg)("inlineCode",{parentName:"p"},"useSession")," hook reads session data in server components."),(0,r.yg)("h2",{id:"example-code"},"Example code"),(0,r.yg)("pre",null,(0,r.yg)("code",{parentName:"pre",className:"language-jsx",metastring:'title="component.server.jsx"',title:'"component.server.jsx"'},"import {useSession} from '@shopify/hydrogen';\nexport default function ServerComponent() {\n  const {countryCode} = useSession();\n  return <div>The country code: {countryCode}</div>;\n}\n")),(0,r.yg)("h2",{id:"return-value"},"Return value"),(0,r.yg)("p",null,"The ",(0,r.yg)("inlineCode",{parentName:"p"},"useSession")," hook returns all data within the current session. The return type is an object with key value pairs."),(0,r.yg)("h2",{id:"considerations"},"Considerations"),(0,r.yg)("ul",null,(0,r.yg)("li",{parentName:"ul"},(0,r.yg)("p",{parentName:"li"},"You can't use the ",(0,r.yg)("inlineCode",{parentName:"p"},"useSession")," hook in client components. If your client components need access to session data, then get the data within server components and explicitly pass the data to client components."),(0,r.yg)("blockquote",{parentName:"li"},(0,r.yg)("p",{parentName:"blockquote"},"Caution:\nSessions typically contain privileged data. Avoid passing all session data to the client."))),(0,r.yg)("li",{parentName:"ul"},(0,r.yg)("p",{parentName:"li"},"Don't update session data within server or client components. Instead, ",(0,r.yg)("a",{parentName:"p",href:"https://shopify.dev/docs/custom-storefronts/hydrogen/sessions/manage-sessions#reading-and-updating-session-data"},"update session data within API routes"),".")),(0,r.yg)("li",{parentName:"ul"},(0,r.yg)("p",{parentName:"li"},"The ",(0,r.yg)("inlineCode",{parentName:"p"},"useSession")," hook will suspend when its called. The length of the suspense depends on where the session data is stored."))),(0,r.yg)("h2",{id:"related-components"},"Related components"),(0,r.yg)("ul",null,(0,r.yg)("li",{parentName:"ul"},(0,r.yg)("a",{parentName:"li",href:"/components/framework/cookie/"},(0,r.yg)("inlineCode",{parentName:"a"},"Cookie"))),(0,r.yg)("li",{parentName:"ul"},(0,r.yg)("a",{parentName:"li",href:"/components/framework/filesessionstorage/"},(0,r.yg)("inlineCode",{parentName:"a"},"FileSessionStorage"))),(0,r.yg)("li",{parentName:"ul"},(0,r.yg)("a",{parentName:"li",href:"/components/framework/cookiesessionstorage/"},(0,r.yg)("inlineCode",{parentName:"a"},"CookieSessionStorage"))),(0,r.yg)("li",{parentName:"ul"},(0,r.yg)("a",{parentName:"li",href:"/components/framework/memorysessionstorage/"},(0,r.yg)("inlineCode",{parentName:"a"},"MemorySessionStorage")))),(0,r.yg)("h2",{id:"related-framework-topics"},"Related framework topics"),(0,r.yg)("ul",null,(0,r.yg)("li",{parentName:"ul"},(0,r.yg)("a",{parentName:"li",href:"https://shopify.dev/custom-storefronts/hydrogen/sessions"},"Session management"))))}m.isMDXComponent=!0}}]);