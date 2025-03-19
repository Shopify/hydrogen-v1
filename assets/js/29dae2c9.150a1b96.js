"use strict";(self.webpackChunkdocs_v_1=self.webpackChunkdocs_v_1||[]).push([[5968],{4137:(e,a,t)=>{t.r(a),t.d(a,{assets:()=>s,contentTitle:()=>o,default:()=>p,frontMatter:()=>l,metadata:()=>i,toc:()=>g});var n=t(8168),r=(t(6540),t(5680));const l={},o="Caching",i={unversionedId:"tutorials/querying/cache",id:"tutorials/querying/cache",title:"Caching",description:"Hydrogen 2.0 is out now. These archival Hydrogen 1.0 docs are provided only to assist developers during their upgrade process. Please migrate as soon as possible.",source:"@site/docs/tutorials/querying/cache.md",sourceDirName:"tutorials/querying",slug:"/tutorials/querying/cache",permalink:"/hydrogen-v1/tutorials/querying/cache",draft:!1,tags:[],version:"current",frontMatter:{},sidebar:"hydrogen",previous:{title:"Querying data in Hydrogen",permalink:"/hydrogen-v1/tutorials/querying/"},next:{title:"Manage caching",permalink:"/hydrogen-v1/tutorials/querying/manage-caching"}},s={},g=[{value:"Caching strategies",id:"caching-strategies",level:2},{value:"Example",id:"example",level:3},{value:"Cache options",id:"cache-options",level:3},{value:"Sub-request caching",id:"sub-request-caching",level:2},{value:"Full-page caching",id:"full-page-caching",level:2},{value:"Default values",id:"default-values",level:2},{value:"Caching in development",id:"caching-in-development",level:2},{value:"Caching in production",id:"caching-in-production",level:2},{value:"Related hooks",id:"related-hooks",level:2},{value:"Next steps",id:"next-steps",level:2}],c={toc:g},u="wrapper";function p(e){let{components:a,...t}=e;return(0,r.yg)(u,(0,n.A)({},c,t,{components:a,mdxType:"MDXLayout"}),(0,r.yg)("h1",{id:"caching"},"Caching"),(0,r.yg)("admonition",{type:"tip"},(0,r.yg)("p",{parentName:"admonition"},"Hydrogen 2.0 is out now. These archival Hydrogen 1.0 docs are provided only to assist developers during their upgrade process. Please ",(0,r.yg)("a",{parentName:"p",href:"/migrate"},"migrate")," as soon as possible.")),(0,r.yg)("p",null,"Caching is a fundamental building block of a good shopping experience. Combined with ",(0,r.yg)("a",{parentName:"p",href:"/tutorials/streaming-ssr/"},"streaming server-side rendering"),", caching ensures that buyers get the quickest response possible while also displaying the latest data."),(0,r.yg)("p",null,"Hydrogen provides two mechanisms for cache within applications:"),(0,r.yg)("ul",null,(0,r.yg)("li",{parentName:"ul"},(0,r.yg)("a",{parentName:"li",href:"#sub-request-caching"},"Sub-request caching")),(0,r.yg)("li",{parentName:"ul"},(0,r.yg)("a",{parentName:"li",href:"#full-page-caching"},"Full-page caching"))),(0,r.yg)("p",null,"Hydrogen also includes ",(0,r.yg)("a",{parentName:"p",href:"#default-values"},"default values for each mechanism"),"."),(0,r.yg)("blockquote",null,(0,r.yg)("p",{parentName:"blockquote"},"Note:\nIf you\u2019re interacting with personalized or private data, then you need to override these defaults to meet your needs.")),(0,r.yg)("h2",{id:"caching-strategies"},"Caching strategies"),(0,r.yg)("p",null,"Hydrogen includes recommended caching strategies to help you determine which cache control header to set. The following table lists the available caching strategies and their associated cache control headers and cache durations:"),(0,r.yg)("table",null,(0,r.yg)("thead",{parentName:"table"},(0,r.yg)("tr",{parentName:"thead"},(0,r.yg)("th",{parentName:"tr",align:null},"Caching strategy"),(0,r.yg)("th",{parentName:"tr",align:null},"Cache control header"),(0,r.yg)("th",{parentName:"tr",align:null},"Cache duration"))),(0,r.yg)("tbody",{parentName:"table"},(0,r.yg)("tr",{parentName:"tbody"},(0,r.yg)("td",{parentName:"tr",align:null},(0,r.yg)("inlineCode",{parentName:"td"},"CacheShort()")),(0,r.yg)("td",{parentName:"tr",align:null},(0,r.yg)("inlineCode",{parentName:"td"},"public, max-age=1, stale-while-revalidate=9")),(0,r.yg)("td",{parentName:"tr",align:null},"10 seconds")),(0,r.yg)("tr",{parentName:"tbody"},(0,r.yg)("td",{parentName:"tr",align:null},(0,r.yg)("inlineCode",{parentName:"td"},"CacheLong()")),(0,r.yg)("td",{parentName:"tr",align:null},(0,r.yg)("inlineCode",{parentName:"td"},"public, max-age=3600, stale-while-revalidate=82800")),(0,r.yg)("td",{parentName:"tr",align:null},"1 Day")),(0,r.yg)("tr",{parentName:"tbody"},(0,r.yg)("td",{parentName:"tr",align:null},(0,r.yg)("inlineCode",{parentName:"td"},"CacheNone()")),(0,r.yg)("td",{parentName:"tr",align:null},(0,r.yg)("inlineCode",{parentName:"td"},"no-store")),(0,r.yg)("td",{parentName:"tr",align:null},"No cache")),(0,r.yg)("tr",{parentName:"tbody"},(0,r.yg)("td",{parentName:"tr",align:null},(0,r.yg)("inlineCode",{parentName:"td"},"CacheCustom()")),(0,r.yg)("td",{parentName:"tr",align:null},"Define your own cache control header"),(0,r.yg)("td",{parentName:"tr",align:null},"Custom")))),(0,r.yg)("p",null,"Learn how to ",(0,r.yg)("a",{parentName:"p",href:"/hydrogen-v1/tutorials/querying/manage-caching#create-a-caching-strategy"},"build your own caching strategy"),"."),(0,r.yg)("h3",{id:"example"},"Example"),(0,r.yg)("pre",null,(0,r.yg)("code",{parentName:"pre",className:"language-jsx"},"import {CacheShort} from '@shopify/hydrogen';\nresponse.cache(CacheShort());\n")),(0,r.yg)("h3",{id:"cache-options"},"Cache options"),(0,r.yg)("p",null,"Each mechanism accepts the same cache options API based on the ",(0,r.yg)("a",{parentName:"p",href:"https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control"},(0,r.yg)("inlineCode",{parentName:"a"},"Cache-Control")," HTTP Header"),":"),(0,r.yg)("pre",null,(0,r.yg)("code",{parentName:"pre",className:"language-ts"},"export interface AllCacheOptions {\n  mode?: string;\n  maxAge?: number;\n  staleWhileRevalidate?: number;\n  sMaxAge?: number;\n  staleIfError?: number;\n}\n")),(0,r.yg)("table",null,(0,r.yg)("thead",{parentName:"table"},(0,r.yg)("tr",{parentName:"thead"},(0,r.yg)("th",{parentName:"tr",align:null},"Name"),(0,r.yg)("th",{parentName:"tr",align:null},"Description"))),(0,r.yg)("tbody",{parentName:"table"},(0,r.yg)("tr",{parentName:"tbody"},(0,r.yg)("td",{parentName:"tr",align:null},(0,r.yg)("inlineCode",{parentName:"td"},"mode")),(0,r.yg)("td",{parentName:"tr",align:null},"Sets options that don't need a duration: ",(0,r.yg)("ul",null,(0,r.yg)("li",null,(0,r.yg)("inlineCode",{parentName:"td"},"no-store"),": The response is prevented from being cached at any layer. This is useful for private or time-sensitive data."),(0,r.yg)("li",null,(0,r.yg)("inlineCode",{parentName:"td"},"private"),": The response is cached in a user\u2019s browser but not at the hosting or edge layer. This is useful for private or customized data."),(0,r.yg)("li",null,(0,r.yg)("inlineCode",{parentName:"td"},"must-revalidate"),": The response must revalidate with the server when ",(0,r.yg)("inlineCode",{parentName:"td"},"max-age")," time is expired.")))),(0,r.yg)("tr",{parentName:"tbody"},(0,r.yg)("td",{parentName:"tr",align:null},(0,r.yg)("inlineCode",{parentName:"td"},"maxAge")),(0,r.yg)("td",{parentName:"tr",align:null},"Correlates with the ",(0,r.yg)("inlineCode",{parentName:"td"},"max-age")," cache control header. Instructs the cache how long to store an entry.")),(0,r.yg)("tr",{parentName:"tbody"},(0,r.yg)("td",{parentName:"tr",align:null},(0,r.yg)("inlineCode",{parentName:"td"},"staleWhileRevalidate")),(0,r.yg)("td",{parentName:"tr",align:null},"Correlates with the ",(0,r.yg)("inlineCode",{parentName:"td"},"stale-while-revalidate")," cache control header. Instructs the cache how long after an entry\u2019s ",(0,r.yg)("inlineCode",{parentName:"td"},"max-Age")," is acceptable to serve a stale entry. Another request for fresh data is made in the background.")),(0,r.yg)("tr",{parentName:"tbody"},(0,r.yg)("td",{parentName:"tr",align:null},(0,r.yg)("inlineCode",{parentName:"td"},"sMaxAge")),(0,r.yg)("td",{parentName:"tr",align:null},"Correlates with the ",(0,r.yg)("inlineCode",{parentName:"td"},"s-maxage")," cache control header. Instructs the cache how long to store an entry on CDN or proxy caches.")),(0,r.yg)("tr",{parentName:"tbody"},(0,r.yg)("td",{parentName:"tr",align:null},(0,r.yg)("inlineCode",{parentName:"td"},"staleIfError")),(0,r.yg)("td",{parentName:"tr",align:null},"Correlates with the ",(0,r.yg)("inlineCode",{parentName:"td"},"stale-if-error")," cache control header. Instructs how long browser is allow to use cached entry when entry returns a 5xx status error.")))),(0,r.yg)("blockquote",null,(0,r.yg)("p",{parentName:"blockquote"},"Note:\nThere are other available cache control headers, but some of them aren't applicable to Hydrogen. For example, the ",(0,r.yg)("inlineCode",{parentName:"p"},"no-cache")," option instructs the browser to not use the cached entry until it returns a ",(0,r.yg)("inlineCode",{parentName:"p"},"304 (Not Modified)")," status from server. However, the Hydrogen server doesn't send a 304 status on a request.")),(0,r.yg)("h2",{id:"sub-request-caching"},"Sub-request caching"),(0,r.yg)("p",null,"While rendering a page in your Hydrogen storefront, it\u2019s common to make one or more sub-requests to Shopify or other third-party data sources within server components. You should use sub-request caching to keep pages loading quickly for end-users. All sub-request have the default ",(0,r.yg)("inlineCode",{parentName:"p"},"CacheShort")," strategy."),(0,r.yg)("p",null," Learn how to ",(0,r.yg)("a",{parentName:"p",href:"/hydrogen-v1/tutorials/querying/manage-caching#modify-sub-request-caching"},"modify sub-request caching"),"."),(0,r.yg)("h2",{id:"full-page-caching"},"Full-page caching"),(0,r.yg)("p",null,"In addition to sub-request caching, it\u2019s helpful to cache the entire page response at the network edge and in the browser. This is the most useful for pages without dynamic or personalized data, like marketing pages or blog content. By default, Hydrogen implements a ",(0,r.yg)("inlineCode",{parentName:"p"},"CacheShort()")," strategy for all full-page requests."),(0,r.yg)("p",null,"Full-page caching is powered completely by ",(0,r.yg)("a",{parentName:"p",href:"https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control"},(0,r.yg)("inlineCode",{parentName:"a"},"cache-control")," headers on the Hydrogen response"),". By default, full-page caching is enabled as long as there is a ",(0,r.yg)("inlineCode",{parentName:"p"},"cache")," available."),(0,r.yg)("p",null,"Learn how to ",(0,r.yg)("a",{parentName:"p",href:"/hydrogen-v1/tutorials/querying/manage-caching#modify-full-page-caching"},"modify full-page caching")),(0,r.yg)("h2",{id:"default-values"},"Default values"),(0,r.yg)("p",null,"Hydrogen provides sensible defaults for all sub-requests and full-page requests cache options."),(0,r.yg)("p",null,"By default, each full-page and sub-request receives the following cache options:"),(0,r.yg)("pre",null,(0,r.yg)("code",{parentName:"pre",className:"language-js"},"public, max-age=1, stale-while-revalidate=9\n")),(0,r.yg)("h2",{id:"caching-in-development"},"Caching in development"),(0,r.yg)("p",null,"A cache control header report displays for each page request. The report includes the associated queries that built the request and the cache control headers:"),(0,r.yg)("pre",null,(0,r.yg)("code",{parentName:"pre",className:"language-sh"},"\u250c\u2500\u2500 Cache control header for http://localhost:3000/collections/freestyle-collection\n\u2502 public, max-age=3600, stale-while-revalidate=82800\n\u2502\n\u2502 query shopInfo          public, max-age=43200, stale-while-revalidate=43200\n\u2502 query CollectionDetails public, max-age=1, stale-while-revalidate=9\n\u2502 query indexContent      public, max-age=60, stale-while-revalidate=600\n\u2502 query Localization      public, max-age=3600, stale-while-revalidate=82800\n\u2514\u2500\u2500\n")),(0,r.yg)("blockquote",null,(0,r.yg)("p",{parentName:"blockquote"},"Note:\nDuring development, disable cache in your browser's developer tools to make sure the latest changes are visible in your browser. For example, you can ",(0,r.yg)("a",{parentName:"p",href:"https://developer.chrome.com/docs/devtools/network/reference/#disable-cache"},"disable cache in Chrome DevTools")," by visiting the ",(0,r.yg)("strong",{parentName:"p"},"Network")," tab.")),(0,r.yg)("blockquote",null,(0,r.yg)("p",{parentName:"blockquote"},"Sub-request caching is disabled by default during development. Learn how to ",(0,r.yg)("a",{parentName:"p",href:"/hydrogen-v1/tutorials/querying/manage-caching#enable-sub-request-caching"},"enable sub-request caching"),".")),(0,r.yg)("h2",{id:"caching-in-production"},"Caching in production"),(0,r.yg)("p",null,"Learn common tasks for ",(0,r.yg)("a",{parentName:"p",href:"/hydrogen-v1/tutorials/querying/manage-caching#caching-in-production"},"managing caching in production"),"."),(0,r.yg)("h2",{id:"related-hooks"},"Related hooks"),(0,r.yg)("ul",null,(0,r.yg)("li",{parentName:"ul"},(0,r.yg)("a",{parentName:"li",href:"/hooks/global/useshopquery/"},(0,r.yg)("inlineCode",{parentName:"a"},"useShopQuery"))),(0,r.yg)("li",{parentName:"ul"},(0,r.yg)("a",{parentName:"li",href:"/hooks/global/fetchsync/"},(0,r.yg)("inlineCode",{parentName:"a"},"fetchSync"))),(0,r.yg)("li",{parentName:"ul"},(0,r.yg)("a",{parentName:"li",href:"/hooks/global/usequery/"},(0,r.yg)("inlineCode",{parentName:"a"},"useQuery")))),(0,r.yg)("h2",{id:"next-steps"},"Next steps"),(0,r.yg)("ul",null,(0,r.yg)("li",{parentName:"ul"},"Learn how to perform common tasks for ",(0,r.yg)("a",{parentName:"li",href:"/tutorials/querying/manage-caching/"},"managing caching in Hydrogen"),".")))}p.isMDXComponent=!0},5680:(e,a,t)=>{t.d(a,{xA:()=>c,yg:()=>h});var n=t(6540);function r(e,a,t){return a in e?Object.defineProperty(e,a,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[a]=t,e}function l(e,a){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);a&&(n=n.filter((function(a){return Object.getOwnPropertyDescriptor(e,a).enumerable}))),t.push.apply(t,n)}return t}function o(e){for(var a=1;a<arguments.length;a++){var t=null!=arguments[a]?arguments[a]:{};a%2?l(Object(t),!0).forEach((function(a){r(e,a,t[a])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):l(Object(t)).forEach((function(a){Object.defineProperty(e,a,Object.getOwnPropertyDescriptor(t,a))}))}return e}function i(e,a){if(null==e)return{};var t,n,r=function(e,a){if(null==e)return{};var t,n,r={},l=Object.keys(e);for(n=0;n<l.length;n++)t=l[n],a.indexOf(t)>=0||(r[t]=e[t]);return r}(e,a);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);for(n=0;n<l.length;n++)t=l[n],a.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(r[t]=e[t])}return r}var s=n.createContext({}),g=function(e){var a=n.useContext(s),t=a;return e&&(t="function"==typeof e?e(a):o(o({},a),e)),t},c=function(e){var a=g(e.components);return n.createElement(s.Provider,{value:a},e.children)},u="mdxType",p={inlineCode:"code",wrapper:function(e){var a=e.children;return n.createElement(n.Fragment,{},a)}},d=n.forwardRef((function(e,a){var t=e.components,r=e.mdxType,l=e.originalType,s=e.parentName,c=i(e,["components","mdxType","originalType","parentName"]),u=g(t),d=r,h=u["".concat(s,".").concat(d)]||u[d]||p[d]||l;return t?n.createElement(h,o(o({ref:a},c),{},{components:t})):n.createElement(h,o({ref:a},c))}));function h(e,a){var t=arguments,r=a&&a.mdxType;if("string"==typeof e||r){var l=t.length,o=new Array(l);o[0]=d;var i={};for(var s in a)hasOwnProperty.call(a,s)&&(i[s]=a[s]);i.originalType=e,i[u]="string"==typeof e?e:r,o[1]=i;for(var g=2;g<l;g++)o[g]=t[g];return n.createElement.apply(null,o)}return n.createElement.apply(null,t)}d.displayName="MDXCreateElement"}}]);