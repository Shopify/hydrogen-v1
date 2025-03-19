"use strict";(self.webpackChunkdocs_v_1=self.webpackChunkdocs_v_1||[]).push([[750],{3809:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>l,contentTitle:()=>p,default:()=>d,frontMatter:()=>a,metadata:()=>i,toc:()=>s});var r=n(8168),o=(n(6540),n(5680));const a={},p="Route",i={unversionedId:"components/framework/route",id:"components/framework/route",title:"Route",description:"The Route component is used to set up a route in Hydrogen that's independent of the file system. Routes are matched in the order that they're defined.",source:"@site/docs/components/framework/route.md",sourceDirName:"components/framework",slug:"/components/framework/route",permalink:"/hydrogen-v1/components/framework/route",draft:!1,tags:[],version:"current",frontMatter:{},sidebar:"hydrogen",previous:{title:"MemorySessionStorage",permalink:"/hydrogen-v1/components/framework/memorysessionstorage"},next:{title:"Router",permalink:"/hydrogen-v1/components/framework/router"}},l={},s=[{value:"Example code",id:"example-code",level:2},{value:"Props",id:"props",level:2},{value:"Component type",id:"component-type",level:2},{value:"Considerations",id:"considerations",level:2},{value:"Related components",id:"related-components",level:2},{value:"Related framework topics",id:"related-framework-topics",level:2}],u={toc:s},m="wrapper";function d(e){let{components:t,...n}=e;return(0,o.yg)(m,(0,r.A)({},u,n,{components:t,mdxType:"MDXLayout"}),(0,o.yg)("h1",{id:"route"},"Route"),(0,o.yg)("p",null,"The ",(0,o.yg)("inlineCode",{parentName:"p"},"Route")," component is used to set up a route in Hydrogen that's independent of the file system. Routes are matched in the order that they're defined."),(0,o.yg)("h2",{id:"example-code"},"Example code"),(0,o.yg)("pre",null,(0,o.yg)("code",{parentName:"pre",className:"language-tsx",metastring:'title="App.server.jsx"',title:'"App.server.jsx"'},'import {Router, Route} from \'@shopify/hydrogen\';\nfunction App() {\n  return (\n    <Suspense fallback={<LoadingFallback />}>\n      <ShopifyProvider>\n        <CartProvider>\n          <Router>\n            <Route path="/" page={<Home />} />\n            <Route path="/products/:handle" page={<Product />} />\n            <Route path="*" page={<NotFound />} />\n          </Router>\n        </CartProvider>\n      </ShopifyProvider>\n    </Suspense>\n  );\n}\nfunction Product({params}) {\n  return <h1>Product name: {params.handle}</h1>;\n}\nfunction Home() {\n  return <h1>Home</h1>;\n}\nfunction NotFound() {\n  return <h1>Not found</h1>;\n}\nexport default renderHydrogen(App);\n')),(0,o.yg)("h2",{id:"props"},"Props"),(0,o.yg)("table",null,(0,o.yg)("thead",{parentName:"table"},(0,o.yg)("tr",{parentName:"thead"},(0,o.yg)("th",{parentName:"tr",align:null},"Name"),(0,o.yg)("th",{parentName:"tr",align:null},"Type"),(0,o.yg)("th",{parentName:"tr",align:null},"Description"))),(0,o.yg)("tbody",{parentName:"table"},(0,o.yg)("tr",{parentName:"tbody"},(0,o.yg)("td",{parentName:"tr",align:null},"path"),(0,o.yg)("td",{parentName:"tr",align:null},(0,o.yg)("inlineCode",{parentName:"td"},"string")),(0,o.yg)("td",{parentName:"tr",align:null},"The URL path where the route exists. The path can contain variables. For example, ",(0,o.yg)("inlineCode",{parentName:"td"},"/products/:handle"),".")),(0,o.yg)("tr",{parentName:"tbody"},(0,o.yg)("td",{parentName:"tr",align:null},"page"),(0,o.yg)("td",{parentName:"tr",align:null},(0,o.yg)("inlineCode",{parentName:"td"},"ReactElement")),(0,o.yg)("td",{parentName:"tr",align:null},"A reference to a React Server Component that's rendered when the route is active.")))),(0,o.yg)("h2",{id:"component-type"},"Component type"),(0,o.yg)("p",null,"The ",(0,o.yg)("inlineCode",{parentName:"p"},"Route")," component is a server component that renders inside ",(0,o.yg)("inlineCode",{parentName:"p"},"App.server.jsx"),". For more information about component types, refer to ",(0,o.yg)("a",{parentName:"p",href:"https://shopify.dev/custom-storefronts/hydrogen/react-server-components"},"React Server Components"),"."),(0,o.yg)("h2",{id:"considerations"},"Considerations"),(0,o.yg)("ul",null,(0,o.yg)("li",{parentName:"ul"},"Only one route renders at a time."),(0,o.yg)("li",{parentName:"ul"},"Use ",(0,o.yg)("inlineCode",{parentName:"li"},'path="*"')," with the last defined ",(0,o.yg)("inlineCode",{parentName:"li"},"<Route>"),' to implement a fallback mechanism on a "Not Found" page.'),(0,o.yg)("li",{parentName:"ul"},"Routes defined with the ",(0,o.yg)("inlineCode",{parentName:"li"},"Route")," component can't be API routes.")),(0,o.yg)("h2",{id:"related-components"},"Related components"),(0,o.yg)("ul",null,(0,o.yg)("li",{parentName:"ul"},(0,o.yg)("a",{parentName:"li",href:"/components/framework/fileroutes/"},(0,o.yg)("inlineCode",{parentName:"a"},"FileRoutes"))),(0,o.yg)("li",{parentName:"ul"},(0,o.yg)("a",{parentName:"li",href:"/components/framework/router/"},(0,o.yg)("inlineCode",{parentName:"a"},"Router")))),(0,o.yg)("h2",{id:"related-framework-topics"},"Related framework topics"),(0,o.yg)("ul",null,(0,o.yg)("li",{parentName:"ul"},(0,o.yg)("a",{parentName:"li",href:"https://shopify.dev/custom-storefronts/hydrogen/routing"},"Routes"))))}d.isMDXComponent=!0},5680:(e,t,n)=>{n.d(t,{xA:()=>u,yg:()=>y});var r=n(6540);function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function a(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function p(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?a(Object(n),!0).forEach((function(t){o(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):a(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function i(e,t){if(null==e)return{};var n,r,o=function(e,t){if(null==e)return{};var n,r,o={},a=Object.keys(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}var l=r.createContext({}),s=function(e){var t=r.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):p(p({},t),e)),n},u=function(e){var t=s(e.components);return r.createElement(l.Provider,{value:t},e.children)},m="mdxType",d={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},c=r.forwardRef((function(e,t){var n=e.components,o=e.mdxType,a=e.originalType,l=e.parentName,u=i(e,["components","mdxType","originalType","parentName"]),m=s(n),c=o,y=m["".concat(l,".").concat(c)]||m[c]||d[c]||a;return n?r.createElement(y,p(p({ref:t},u),{},{components:n})):r.createElement(y,p({ref:t},u))}));function y(e,t){var n=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var a=n.length,p=new Array(a);p[0]=c;var i={};for(var l in t)hasOwnProperty.call(t,l)&&(i[l]=t[l]);i.originalType=e,i[m]="string"==typeof e?e:o,p[1]=i;for(var s=2;s<a;s++)p[s]=n[s];return r.createElement.apply(null,p)}return r.createElement.apply(null,n)}c.displayName="MDXCreateElement"}}]);