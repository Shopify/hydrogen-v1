"use strict";(self.webpackChunkdocs_v_1=self.webpackChunkdocs_v_1||[]).push([[2421],{5680:(e,n,t)=>{t.d(n,{xA:()=>y,yg:()=>h});var a=t(6540);function r(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function o(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);n&&(a=a.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,a)}return t}function i(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?o(Object(t),!0).forEach((function(n){r(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):o(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function l(e,n){if(null==e)return{};var t,a,r=function(e,n){if(null==e)return{};var t,a,r={},o=Object.keys(e);for(a=0;a<o.length;a++)t=o[a],n.indexOf(t)>=0||(r[t]=e[t]);return r}(e,n);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(a=0;a<o.length;a++)t=o[a],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(r[t]=e[t])}return r}var s=a.createContext({}),p=function(e){var n=a.useContext(s),t=n;return e&&(t="function"==typeof e?e(n):i(i({},n),e)),t},y=function(e){var n=p(e.components);return a.createElement(s.Provider,{value:n},e.children)},c="mdxType",g={inlineCode:"code",wrapper:function(e){var n=e.children;return a.createElement(a.Fragment,{},n)}},d=a.forwardRef((function(e,n){var t=e.components,r=e.mdxType,o=e.originalType,s=e.parentName,y=l(e,["components","mdxType","originalType","parentName"]),c=p(t),d=r,h=c["".concat(s,".").concat(d)]||c[d]||g[d]||o;return t?a.createElement(h,i(i({ref:n},y),{},{components:t})):a.createElement(h,i({ref:n},y))}));function h(e,n){var t=arguments,r=n&&n.mdxType;if("string"==typeof e||r){var o=t.length,i=new Array(o);i[0]=d;var l={};for(var s in n)hasOwnProperty.call(n,s)&&(l[s]=n[s]);l.originalType=e,l[c]="string"==typeof e?e:r,i[1]=l;for(var p=2;p<o;p++)i[p]=t[p];return a.createElement.apply(null,i)}return a.createElement.apply(null,t)}d.displayName="MDXCreateElement"},6438:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>s,contentTitle:()=>i,default:()=>g,frontMatter:()=>o,metadata:()=>l,toc:()=>p});var a=t(8168),r=(t(6540),t(5680));const o={},i="fetchSync",l={unversionedId:"hooks/global/fetchsync",id:"hooks/global/fetchsync",title:"fetchSync",description:"The fetchSync hook makes API requests and is the recommended way to make simple fetch calls on the server and on the client. It's designed similar to the Web API's fetch, only in a way that supports Suspense.",source:"@site/docs/hooks/global/fetchsync.md",sourceDirName:"hooks/global",slug:"/hooks/global/fetchsync",permalink:"/hydrogen-v1/hooks/global/fetchsync",draft:!1,tags:[],version:"current",frontMatter:{},sidebar:"hydrogen",previous:{title:"useSession",permalink:"/hydrogen-v1/hooks/framework/usesession"},next:{title:"useDelay",permalink:"/hydrogen-v1/hooks/global/usedelay"}},s={},p=[{value:"Example code",id:"example-code",level:2},{value:"<code>fetchSync</code> in server components",id:"fetchsync-in-server-components",level:2},{value:"Arguments",id:"arguments",level:3},{value:"Return value",id:"return-value",level:3},{value:"<code>fetchSync</code> in client components",id:"fetchsync-in-client-components",level:2},{value:"Arguments",id:"arguments-1",level:3},{value:"Return value",id:"return-value-1",level:3},{value:"Considerations",id:"considerations",level:2},{value:"<code>fetchSync</code> in server components",id:"fetchsync-in-server-components-1",level:3},{value:"<code>fetchSync</code> in client components",id:"fetchsync-in-client-components-1",level:3},{value:"Related hooks",id:"related-hooks",level:2},{value:"Related framework topics",id:"related-framework-topics",level:2}],y={toc:p},c="wrapper";function g(e){let{components:n,...t}=e;return(0,r.yg)(c,(0,a.A)({},y,t,{components:n,mdxType:"MDXLayout"}),(0,r.yg)("h1",{id:"fetchsync"},"fetchSync"),(0,r.yg)("p",null,"The ",(0,r.yg)("inlineCode",{parentName:"p"},"fetchSync")," hook makes API requests and is the recommended way to make simple fetch calls on the server and on the client. It's designed similar to the ",(0,r.yg)("a",{parentName:"p",href:"https://developer.mozilla.org/en-US/docs/Web/API/fetch"},"Web API's ",(0,r.yg)("inlineCode",{parentName:"a"},"fetch")),", only in a way that supports ",(0,r.yg)("a",{parentName:"p",href:"https://reactjs.org/docs/concurrent-mode-suspense.html"},"Suspense"),"."),(0,r.yg)("h2",{id:"example-code"},"Example code"),(0,r.yg)("pre",null,(0,r.yg)("code",{parentName:"pre",className:"language-jsx",metastring:'title="MyComponent.server.js"',title:'"MyComponent.server.js"'},"import {fetchSync} from '@shopify/hydrogen';\nimport {Suspense} from 'react';\n// Use `Suspense` boundaries to define where you want your app to display a loading indicator while your data is being accessed.\nexport function MyComponent() {\n  return (\n    <Suspense fallback=\"Loading...\">\n      <MyThings />\n    </Suspense>\n  );\n}\nfunction MyThings() {\n  // To request data from a third-party API, pass the URL to `fetchSync` along with any arguments.\n  const things = fetchSync('https://3p.api.com/things.json', {\n    method: 'post',\n  }).json();\n  return <h2>{things.title}</h2>;\n}\n")),(0,r.yg)("h2",{id:"fetchsync-in-server-components"},(0,r.yg)("inlineCode",{parentName:"h2"},"fetchSync")," in server components"),(0,r.yg)("p",null,"If you're using ",(0,r.yg)("inlineCode",{parentName:"p"},"fetchSync")," in a server component, then you provide options for caching and preloading. This is similar to the ",(0,r.yg)("a",{parentName:"p",href:"/hooks/global/usequery/"},(0,r.yg)("inlineCode",{parentName:"a"},"useQuery"))," hook:"),(0,r.yg)("pre",null,(0,r.yg)("code",{parentName:"pre",className:"language-jsx",metastring:'title="MyComponent.server.js"',title:'"MyComponent.server.js"'},"import {fetchSync, CacheLong} from '@shopify/hydrogen';\nimport {Suspense} from 'react';\nexport function MyComponent() {\n  return (\n    <Suspense fallback=\"Loading...\">\n      <MyThings />\n    </Suspense>\n  );\n}\nfunction MyThings() {\n  const things = fetchSync('https://3p.api.com/things.json', {\n    preload: true,\n    cache: CacheLong(),\n  }).json();\n  return <h2>{things.title}</h2>;\n}\n")),(0,r.yg)("h3",{id:"arguments"},"Arguments"),(0,r.yg)("p",null,"The ",(0,r.yg)("inlineCode",{parentName:"p"},"fetchSync")," hook takes the following arguments:"),(0,r.yg)("table",null,(0,r.yg)("thead",{parentName:"table"},(0,r.yg)("tr",{parentName:"thead"},(0,r.yg)("th",{parentName:"tr",align:null},"Key"),(0,r.yg)("th",{parentName:"tr",align:null},"Required"),(0,r.yg)("th",{parentName:"tr",align:null},"Description"))),(0,r.yg)("tbody",{parentName:"table"},(0,r.yg)("tr",{parentName:"tbody"},(0,r.yg)("td",{parentName:"tr",align:null},(0,r.yg)("inlineCode",{parentName:"td"},"string")),(0,r.yg)("td",{parentName:"tr",align:null},"Yes"),(0,r.yg)("td",{parentName:"tr",align:null},"A URL to fetch.")),(0,r.yg)("tr",{parentName:"tbody"},(0,r.yg)("td",{parentName:"tr",align:null},(0,r.yg)("inlineCode",{parentName:"td"},"requestInit")),(0,r.yg)("td",{parentName:"tr",align:null},"No"),(0,r.yg)("td",{parentName:"tr",align:null},"The options to manage the fetch behavior and cache behavior of the request.")))),(0,r.yg)("p",null,"The ",(0,r.yg)("inlineCode",{parentName:"p"},"requestInit")," object augments the ",(0,r.yg)("a",{parentName:"p",href:"https://developer.mozilla.org/en-US/docs/Web/API/Request/Request"},(0,r.yg)("inlineCode",{parentName:"a"},"init")," properties available in the Web Fetch API")," to include the following additional properties:"),(0,r.yg)("table",null,(0,r.yg)("thead",{parentName:"table"},(0,r.yg)("tr",{parentName:"thead"},(0,r.yg)("th",{parentName:"tr",align:null},"Key"),(0,r.yg)("th",{parentName:"tr",align:null},"Required"),(0,r.yg)("th",{parentName:"tr",align:null},"Description"))),(0,r.yg)("tbody",{parentName:"table"},(0,r.yg)("tr",{parentName:"tbody"},(0,r.yg)("td",{parentName:"tr",align:null},(0,r.yg)("inlineCode",{parentName:"td"},"cache")),(0,r.yg)("td",{parentName:"tr",align:null},"No"),(0,r.yg)("td",{parentName:"tr",align:null},"The ",(0,r.yg)("a",{parentName:"td",href:"https://shopify.dev/custom-storefronts/hydrogen/querying/cache#caching-strategies"},"caching strategy")," to help you determine which cache control header to set.")),(0,r.yg)("tr",{parentName:"tbody"},(0,r.yg)("td",{parentName:"tr",align:null},(0,r.yg)("inlineCode",{parentName:"td"},"preload")),(0,r.yg)("td",{parentName:"tr",align:null},"No"),(0,r.yg)("td",{parentName:"tr",align:null},"Whether to ",(0,r.yg)("a",{parentName:"td",href:"https://shopify.dev/custom-storefronts/hydrogen/querying/preloaded-queries"},"preload the request"),". It defaults to true only when the ",(0,r.yg)("inlineCode",{parentName:"td"},"CachingStrategy")," is not ",(0,r.yg)("inlineCode",{parentName:"td"},"CacheNone"),". Specify ",(0,r.yg)("inlineCode",{parentName:"td"},"false")," to disable or use ",(0,r.yg)("inlineCode",{parentName:"td"},"'*'")," to preload the query for all requests.")),(0,r.yg)("tr",{parentName:"tbody"},(0,r.yg)("td",{parentName:"tr",align:null},(0,r.yg)("inlineCode",{parentName:"td"},"shouldCacheResponse")),(0,r.yg)("td",{parentName:"tr",align:null},"No"),(0,r.yg)("td",{parentName:"tr",align:null},"A function that inspects the response body to determine if it should be cached.")))),(0,r.yg)("h3",{id:"return-value"},"Return value"),(0,r.yg)("p",null,"The ",(0,r.yg)("inlineCode",{parentName:"p"},"fetchSync")," function returns a ",(0,r.yg)("a",{parentName:"p",href:"https://developer.mozilla.org/en-US/docs/Web/API/Response"},"Response object and its properties"),". However, the following properties are adapted to work with React Suspense:"),(0,r.yg)("table",null,(0,r.yg)("thead",{parentName:"table"},(0,r.yg)("tr",{parentName:"thead"},(0,r.yg)("th",{parentName:"tr",align:null},"Key"),(0,r.yg)("th",{parentName:"tr",align:null},"Description"))),(0,r.yg)("tbody",{parentName:"table"},(0,r.yg)("tr",{parentName:"tbody"},(0,r.yg)("td",{parentName:"tr",align:null},(0,r.yg)("inlineCode",{parentName:"td"},"json()")),(0,r.yg)("td",{parentName:"tr",align:null},"A function to synchronously return a JavaScript object based on the JSON response body.")),(0,r.yg)("tr",{parentName:"tbody"},(0,r.yg)("td",{parentName:"tr",align:null},(0,r.yg)("inlineCode",{parentName:"td"},"text()")),(0,r.yg)("td",{parentName:"tr",align:null},"A function to synchronously return a string version of the response body.")))),(0,r.yg)("h2",{id:"fetchsync-in-client-components"},(0,r.yg)("inlineCode",{parentName:"h2"},"fetchSync")," in client components"),(0,r.yg)("p",null,"If you're using ",(0,r.yg)("inlineCode",{parentName:"p"},"fetchSync")," in a client component, then you can't provide options for caching and preloading in client components:"),(0,r.yg)("pre",null,(0,r.yg)("code",{parentName:"pre",className:"language-jsx",metastring:'title="MyComponent.client.js"',title:'"MyComponent.client.js"'},"import {fetchSync} from '@shopify/hydrogen';\nimport {Suspense} from 'react';\nexport function MyComponent() {\n  return (\n    <Suspense fallback=\"Loading...\">\n      <MyThings />\n    </Suspense>\n  );\n}\nfunction MyThings() {\n  const things = fetchSync('https://3p.api.com/things.json').json();\n  return <h2>{things.title}</h2>;\n}\n")),(0,r.yg)("h3",{id:"arguments-1"},"Arguments"),(0,r.yg)("p",null,"The ",(0,r.yg)("inlineCode",{parentName:"p"},"fetchSync")," hook takes the following arguments:"),(0,r.yg)("table",null,(0,r.yg)("thead",{parentName:"table"},(0,r.yg)("tr",{parentName:"thead"},(0,r.yg)("th",{parentName:"tr",align:null},"Key"),(0,r.yg)("th",{parentName:"tr",align:null},"Required"),(0,r.yg)("th",{parentName:"tr",align:null},"Description"))),(0,r.yg)("tbody",{parentName:"table"},(0,r.yg)("tr",{parentName:"tbody"},(0,r.yg)("td",{parentName:"tr",align:null},(0,r.yg)("inlineCode",{parentName:"td"},"string")),(0,r.yg)("td",{parentName:"tr",align:null},"Yes"),(0,r.yg)("td",{parentName:"tr",align:null},"A URL to fetch.")),(0,r.yg)("tr",{parentName:"tbody"},(0,r.yg)("td",{parentName:"tr",align:null},(0,r.yg)("inlineCode",{parentName:"td"},"requestInit")),(0,r.yg)("td",{parentName:"tr",align:null},"No"),(0,r.yg)("td",{parentName:"tr",align:null},"The options to manage the fetch behavior of the request.")))),(0,r.yg)("p",null,"The ",(0,r.yg)("inlineCode",{parentName:"p"},"requestInit")," object mirrors the ",(0,r.yg)("a",{parentName:"p",href:"https://developer.mozilla.org/en-US/docs/Web/API/Request/Request"},(0,r.yg)("inlineCode",{parentName:"a"},"init")," properties available in the Web Fetch API"),"."),(0,r.yg)("h3",{id:"return-value-1"},"Return value"),(0,r.yg)("p",null,"The ",(0,r.yg)("inlineCode",{parentName:"p"},"fetchSync")," function returns a ",(0,r.yg)("a",{parentName:"p",href:"https://developer.mozilla.org/en-US/docs/Web/API/Response"},"Response object and its properties"),". However, the following properties are adapted to work with React Suspense:"),(0,r.yg)("table",null,(0,r.yg)("thead",{parentName:"table"},(0,r.yg)("tr",{parentName:"thead"},(0,r.yg)("th",{parentName:"tr",align:null},"Key"),(0,r.yg)("th",{parentName:"tr",align:null},"Description"))),(0,r.yg)("tbody",{parentName:"table"},(0,r.yg)("tr",{parentName:"tbody"},(0,r.yg)("td",{parentName:"tr",align:null},(0,r.yg)("inlineCode",{parentName:"td"},"json()")),(0,r.yg)("td",{parentName:"tr",align:null},"A function to synchronously return a JavaScript object based on the JSON response body.")),(0,r.yg)("tr",{parentName:"tbody"},(0,r.yg)("td",{parentName:"tr",align:null},(0,r.yg)("inlineCode",{parentName:"td"},"text()")),(0,r.yg)("td",{parentName:"tr",align:null},"A function to synchronously return a string version of the response body.")))),(0,r.yg)("h2",{id:"considerations"},"Considerations"),(0,r.yg)("p",null,"The following considerations apply to ",(0,r.yg)("inlineCode",{parentName:"p"},"fetchSync")," in server and client components."),(0,r.yg)("h3",{id:"fetchsync-in-server-components-1"},(0,r.yg)("inlineCode",{parentName:"h3"},"fetchSync")," in server components"),(0,r.yg)("ul",null,(0,r.yg)("li",{parentName:"ul"},"Don't use ",(0,r.yg)("inlineCode",{parentName:"li"},"async/await")," with the ",(0,r.yg)("inlineCode",{parentName:"li"},"fetchSync")," helper provided by Hydrogen. Hydrogen wraps the native fetch call in a way that supports Suspense boundaries."),(0,r.yg)("li",{parentName:"ul"},"Process the response contents with ",(0,r.yg)("inlineCode",{parentName:"li"},"json()")," or ",(0,r.yg)("inlineCode",{parentName:"li"},"text()")," helpers."),(0,r.yg)("li",{parentName:"ul"},"Don't use ",(0,r.yg)("inlineCode",{parentName:"li"},"fetchSync")," on the server to call an endpoint within the same Hydrogen app. This causes issues in some production runtimes. Instead, make the query for the data directly.")),(0,r.yg)("h3",{id:"fetchsync-in-client-components-1"},(0,r.yg)("inlineCode",{parentName:"h3"},"fetchSync")," in client components"),(0,r.yg)("ul",null,(0,r.yg)("li",{parentName:"ul"},"Suspense boundaries in client components are rendered during server-side rendering (SSR). This means the fallback is streamed to the client while the fetch call runs."),(0,r.yg)("li",{parentName:"ul"},"Data fetched on the server during SSR isn't serialized to the client. This means that your client ",(0,r.yg)("inlineCode",{parentName:"li"},"fetchSync")," function will run twice during initial page load: once on the server and once on the client."),(0,r.yg)("li",{parentName:"ul"},"Suspense boundaries inside client components rendered during a subsequent navigation are only rendered on the client and not on the server."),(0,r.yg)("li",{parentName:"ul"},"If you include browser-only logic inside your client component Suspense boundary, which would otherwise fail on the server, then you should conditionally include the suspending component with a piece of client state activated by ",(0,r.yg)("inlineCode",{parentName:"li"},"useEffect")," or with a user action: ",(0,r.yg)("inlineCode",{parentName:"li"},"{isLoaded && <Suspense><MyComponent></Suspense>}"),"."),(0,r.yg)("li",{parentName:"ul"},"If you're using ",(0,r.yg)("inlineCode",{parentName:"li"},"fetchSync")," to call an API endpoint in the same Hydrogen app, then you must wrap the call in conditional logic with a piece of client state that's activated by ",(0,r.yg)("inlineCode",{parentName:"li"},"useEffect"),". This ensures that ",(0,r.yg)("inlineCode",{parentName:"li"},"fetchSync")," doesn't execute during pre-rendering (SSR): ",(0,r.yg)("inlineCode",{parentName:"li"},"{isLoaded && <Suspense><MyComponent></Suspense>}"),".")),(0,r.yg)("h2",{id:"related-hooks"},"Related hooks"),(0,r.yg)("ul",null,(0,r.yg)("li",{parentName:"ul"},(0,r.yg)("a",{parentName:"li",href:"/hooks/global/useshopquery/"},(0,r.yg)("inlineCode",{parentName:"a"},"useShopQuery"))),(0,r.yg)("li",{parentName:"ul"},(0,r.yg)("a",{parentName:"li",href:"/hooks/global/usequery/"},(0,r.yg)("inlineCode",{parentName:"a"},"useQuery")))),(0,r.yg)("h2",{id:"related-framework-topics"},"Related framework topics"),(0,r.yg)("ul",null,(0,r.yg)("li",{parentName:"ul"},(0,r.yg)("a",{parentName:"li",href:"https://shopify.dev/custom-storefronts/hydrogen/querying/cache"},"Caching")),(0,r.yg)("li",{parentName:"ul"},(0,r.yg)("a",{parentName:"li",href:"https://shopify.dev/custom-storefronts/hydrogen/querying/preloaded-queries"},"Preloaded queries")),(0,r.yg)("li",{parentName:"ul"},(0,r.yg)("a",{parentName:"li",href:"https://shopify.dev/custom-storefronts/hydrogen/routing"},"Routes")),(0,r.yg)("li",{parentName:"ul"},(0,r.yg)("a",{parentName:"li",href:"https://shopify.dev/custom-storefronts/hydrogen/react-server-components/work-with-rsc"},"Working with React Server Components"))))}g.isMDXComponent=!0}}]);