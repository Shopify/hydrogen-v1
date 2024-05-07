"use strict";(self.webpackChunkdocs_v_1=self.webpackChunkdocs_v_1||[]).push([[2909],{5680:(e,t,n)=>{n.d(t,{xA:()=>p,yg:()=>m});var s=n(6540);function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function r(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(e);t&&(s=s.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,s)}return n}function a(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?r(Object(n),!0).forEach((function(t){o(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):r(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function i(e,t){if(null==e)return{};var n,s,o=function(e,t){if(null==e)return{};var n,s,o={},r=Object.keys(e);for(s=0;s<r.length;s++)n=r[s],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);for(s=0;s<r.length;s++)n=r[s],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}var l=s.createContext({}),g=function(e){var t=s.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):a(a({},t),e)),n},p=function(e){var t=g(e.components);return s.createElement(l.Provider,{value:t},e.children)},u="mdxType",d={inlineCode:"code",wrapper:function(e){var t=e.children;return s.createElement(s.Fragment,{},t)}},y=s.forwardRef((function(e,t){var n=e.components,o=e.mdxType,r=e.originalType,l=e.parentName,p=i(e,["components","mdxType","originalType","parentName"]),u=g(n),y=o,m=u["".concat(l,".").concat(y)]||u[y]||d[y]||r;return n?s.createElement(m,a(a({ref:t},p),{},{components:n})):s.createElement(m,a({ref:t},p))}));function m(e,t){var n=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var r=n.length,a=new Array(r);a[0]=y;var i={};for(var l in t)hasOwnProperty.call(t,l)&&(i[l]=t[l]);i.originalType=e,i[u]="string"==typeof e?e:o,a[1]=i;for(var g=2;g<r;g++)a[g]=n[g];return s.createElement.apply(null,a)}return s.createElement.apply(null,n)}y.displayName="MDXCreateElement"},5266:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>l,contentTitle:()=>a,default:()=>d,frontMatter:()=>r,metadata:()=>i,toc:()=>g});var s=n(8168),o=(n(6540),n(5680));const r={},a="Sessions",i={unversionedId:"tutorials/sessions/index",id:"tutorials/sessions/index",title:"Sessions",description:"Hydrogen 2.0 is out now. These archival Hydrogen 1.0 docs are provided only to assist developers during their upgrade process. Please migrate as soon as possible.",source:"@site/docs/tutorials/sessions/index.md",sourceDirName:"tutorials/sessions",slug:"/tutorials/sessions/",permalink:"/hydrogen-v1/tutorials/sessions/",draft:!1,tags:[],version:"current",frontMatter:{},sidebar:"hydrogen",previous:{title:"Server props",permalink:"/hydrogen-v1/tutorials/server-props"},next:{title:"Manage sessions",permalink:"/hydrogen-v1/tutorials/sessions/manage-sessions"}},l={},g=[{value:"Types of session storage",id:"types-of-session-storage",level:2},{value:"Configuring sessions",id:"configuring-sessions",level:2},{value:"Related components and hooks",id:"related-components-and-hooks",level:2},{value:"Next steps",id:"next-steps",level:2}],p={toc:g},u="wrapper";function d(e){let{components:t,...n}=e;return(0,o.yg)(u,(0,s.A)({},p,n,{components:t,mdxType:"MDXLayout"}),(0,o.yg)("h1",{id:"sessions"},"Sessions"),(0,o.yg)("admonition",{type:"tip"},(0,o.yg)("p",{parentName:"admonition"},"Hydrogen 2.0 is out now. These archival Hydrogen 1.0 docs are provided only to assist developers during their upgrade process. Please ",(0,o.yg)("a",{parentName:"p",href:"/migrate"},"migrate")," as soon as possible.")),(0,o.yg)("aside",{class:"note beta"},(0,o.yg)("h4",null,"Experimental feature"),(0,o.yg)("p",null,"Session management is an experimental feature. As a result, functionality is subject to change. You can provide feedback on this feature by ",(0,o.yg)("a",{href:"https://github.com/Shopify/hydrogen/issues"},"submitting an issue in GitHub"),".")),(0,o.yg)("p",null,"A session is a set of user interactions that take place within a given timeframe. Each session tracks the global data that's unique to each user."),(0,o.yg)("p",null,"The Hydrogen framework includes built-in support for session management. This guide provides an introduction to how sessions work in your Hydrogen app."),(0,o.yg)("p",null,"For example, session data might contain the products within a cart, site preferences, and user identity. Session data persists across page refreshes, but it eventually expires, depending on how it's configured."),(0,o.yg)("h2",{id:"types-of-session-storage"},"Types of session storage"),(0,o.yg)("p",null,"The following table describes the types of session storage available by default in Hydrogen:"),(0,o.yg)("table",null,(0,o.yg)("thead",{parentName:"table"},(0,o.yg)("tr",{parentName:"thead"},(0,o.yg)("th",{parentName:"tr",align:null},"Type"),(0,o.yg)("th",{parentName:"tr",align:null},"Component"),(0,o.yg)("th",{parentName:"tr",align:null},"Description"))),(0,o.yg)("tbody",{parentName:"table"},(0,o.yg)("tr",{parentName:"tbody"},(0,o.yg)("td",{parentName:"tr",align:null},"Cookie session storage"),(0,o.yg)("td",{parentName:"tr",align:null},(0,o.yg)("a",{parentName:"td",href:"/components/framework/cookiesessionstorage/"},"CookieSessionStorage")),(0,o.yg)("td",{parentName:"tr",align:null},"The default session storage mechanism for Hydrogen. Cookies are convenient because you don't need a database or another backend service to persist the data.")),(0,o.yg)("tr",{parentName:"tbody"},(0,o.yg)("td",{parentName:"tr",align:null},"In-memory session storage"),(0,o.yg)("td",{parentName:"tr",align:null},(0,o.yg)("a",{parentName:"td",href:"/components/framework/memorysessionstorage/"},"MemorySessionStorage")),(0,o.yg)("td",{parentName:"tr",align:null},"Stores the session data within Hydrogen runtime memory. You still need to configure cookies because a unique session ID is stored within the browser cookie, even though associated session data is stored in memory.")),(0,o.yg)("tr",{parentName:"tbody"},(0,o.yg)("td",{parentName:"tr",align:null},"File session storage"),(0,o.yg)("td",{parentName:"tr",align:null},(0,o.yg)("a",{parentName:"td",href:"/components/framework/filesessionstorage/"},"FileSessionStorage")),(0,o.yg)("td",{parentName:"tr",align:null},"Persists session data to the file system. This is useful if you need to store a lot of data in the session (more than the 4kb cookie limit/) and also have the data persist when Hydrogen restarts. ",(0,o.yg)("br",null),"Cookie configuration is still necessary because a unique session ID is stored within the browser cookie, although associated session data is stored in the file system.")))),(0,o.yg)("h2",{id:"configuring-sessions"},"Configuring sessions"),(0,o.yg)("p",null,"The ",(0,o.yg)("a",{parentName:"p",href:"/tutorials/getting-started/templates/"},"Demo Store template")," comes pre-configured with session support."),(0,o.yg)("p",null,"By default, session data is persisted within a cookie. You can adjust the session cookie configuration within your Hydrogen configuration file for an in-memory storage or file-based storage (NodeJS only), or build your own storage adapter. ",(0,o.yg)("a",{parentName:"p",href:"/tutorials/sessions/manage-sessions/"},"Learn how"),"."),(0,o.yg)("h2",{id:"related-components-and-hooks"},"Related components and hooks"),(0,o.yg)("ul",null,(0,o.yg)("li",{parentName:"ul"},(0,o.yg)("a",{parentName:"li",href:"/components/framework/cookie/"},(0,o.yg)("inlineCode",{parentName:"a"},"Cookie"))),(0,o.yg)("li",{parentName:"ul"},(0,o.yg)("a",{parentName:"li",href:"/components/framework/cookiesessionstorage/"},(0,o.yg)("inlineCode",{parentName:"a"},"CookieSessionStorage"))),(0,o.yg)("li",{parentName:"ul"},(0,o.yg)("a",{parentName:"li",href:"/components/framework/memorysessionstorage/"},(0,o.yg)("inlineCode",{parentName:"a"},"MemorySessionStorage"))),(0,o.yg)("li",{parentName:"ul"},(0,o.yg)("a",{parentName:"li",href:"/components/framework/filesessionstorage/"},(0,o.yg)("inlineCode",{parentName:"a"},"FileSessionStorage"))),(0,o.yg)("li",{parentName:"ul"},(0,o.yg)("a",{parentName:"li",href:"/hooks/framework/usesession/"},(0,o.yg)("inlineCode",{parentName:"a"},"useSession")))),(0,o.yg)("h2",{id:"next-steps"},"Next steps"),(0,o.yg)("ul",null,(0,o.yg)("li",{parentName:"ul"},"Learn how to perform common tasks for ",(0,o.yg)("a",{parentName:"li",href:"/tutorials/sessions/manage-sessions/"},"managing sessions in Hydrogen"),".")))}d.isMDXComponent=!0}}]);