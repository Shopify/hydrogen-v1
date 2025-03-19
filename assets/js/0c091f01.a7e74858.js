"use strict";(self.webpackChunkdocs_v_1=self.webpackChunkdocs_v_1||[]).push([[6261],{673:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>l,contentTitle:()=>i,default:()=>s,frontMatter:()=>o,metadata:()=>p,toc:()=>c});var r=n(8168),a=(n(6540),n(5680));const o={},i="CartLineQuantity",p={unversionedId:"components/cart/cartlinequantity",id:"components/cart/cartlinequantity",title:"CartLineQuantity",description:"The CartLineQuantity component renders a span element (or the type of HTML element",source:"@site/docs/components/cart/cartlinequantity.md",sourceDirName:"components/cart",slug:"/components/cart/cartlinequantity",permalink:"/hydrogen-v1/components/cart/cartlinequantity",draft:!1,tags:[],version:"current",frontMatter:{},sidebar:"hydrogen",previous:{title:"CartLineProvider",permalink:"/hydrogen-v1/components/cart/cartlineprovider"},next:{title:"CartLineQuantityAdjustButton",permalink:"/hydrogen-v1/components/cart/cartlinequantityadjustbutton"}},l={},c=[{value:"Example code",id:"example-code",level:2},{value:"Props",id:"props",level:2},{value:"Component type",id:"component-type",level:2},{value:"Related components",id:"related-components",level:2}],y={toc:c},m="wrapper";function s(e){let{components:t,...n}=e;return(0,a.yg)(m,(0,r.A)({},y,n,{components:t,mdxType:"MDXLayout"}),(0,a.yg)("h1",{id:"cartlinequantity"},"CartLineQuantity"),(0,a.yg)("p",null,"The ",(0,a.yg)("inlineCode",{parentName:"p"},"CartLineQuantity")," component renders a ",(0,a.yg)("inlineCode",{parentName:"p"},"span")," element (or the type of HTML element\nspecified by the ",(0,a.yg)("inlineCode",{parentName:"p"},"as")," prop) with the cart line's quantity. It must be a descendent of a ",(0,a.yg)("inlineCode",{parentName:"p"},"CartLineProvider")," component."),(0,a.yg)("h2",{id:"example-code"},"Example code"),(0,a.yg)("pre",null,(0,a.yg)("code",{parentName:"pre",className:"language-tsx"},"import {CartLineProvider, useCart, CartLineQuantity} from '@shopify/hydrogen';\n\nexport function App() {\n  const {lines} = useCart();\n\n  return lines.map((line) => {\n    return (\n      <CartLineProvider key={line.id} line={line}>\n        <CartLineQuantity />\n      </CartLineProvider>\n    );\n  });\n}\n")),(0,a.yg)("h2",{id:"props"},"Props"),(0,a.yg)("table",null,(0,a.yg)("thead",{parentName:"table"},(0,a.yg)("tr",{parentName:"thead"},(0,a.yg)("th",{parentName:"tr",align:null},"Name"),(0,a.yg)("th",{parentName:"tr",align:null},"Type"),(0,a.yg)("th",{parentName:"tr",align:null},"Description"))),(0,a.yg)("tbody",{parentName:"table"},(0,a.yg)("tr",{parentName:"tbody"},(0,a.yg)("td",{parentName:"tr",align:null},(0,a.yg)("inlineCode",{parentName:"td"},"as")),(0,a.yg)("td",{parentName:"tr",align:null},(0,a.yg)("inlineCode",{parentName:"td"},"TTag")),(0,a.yg)("td",{parentName:"tr",align:null},"An HTML tag to be rendered as the base element wrapper. The default is ",(0,a.yg)("inlineCode",{parentName:"td"},"div"),".")))),(0,a.yg)("h2",{id:"component-type"},"Component type"),(0,a.yg)("p",null,"The ",(0,a.yg)("inlineCode",{parentName:"p"},"CartLineQuantity")," component is a client component, which means that it renders on the client. For more information about component types, refer to ",(0,a.yg)("a",{parentName:"p",href:"https://shopify.dev/custom-storefronts/hydrogen/react-server-components"},"React Server Components"),"."),(0,a.yg)("h2",{id:"related-components"},"Related components"),(0,a.yg)("ul",null,(0,a.yg)("li",{parentName:"ul"},(0,a.yg)("a",{parentName:"li",href:"/components/cart/cartlineprovider/"},(0,a.yg)("inlineCode",{parentName:"a"},"CartLineProvider")))))}s.isMDXComponent=!0},5680:(e,t,n)=>{n.d(t,{xA:()=>y,yg:()=>d});var r=n(6540);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function p(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},o=Object.keys(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var l=r.createContext({}),c=function(e){var t=r.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},y=function(e){var t=c(e.components);return r.createElement(l.Provider,{value:t},e.children)},m="mdxType",s={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},u=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,o=e.originalType,l=e.parentName,y=p(e,["components","mdxType","originalType","parentName"]),m=c(n),u=a,d=m["".concat(l,".").concat(u)]||m[u]||s[u]||o;return n?r.createElement(d,i(i({ref:t},y),{},{components:n})):r.createElement(d,i({ref:t},y))}));function d(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=n.length,i=new Array(o);i[0]=u;var p={};for(var l in t)hasOwnProperty.call(t,l)&&(p[l]=t[l]);p.originalType=e,p[m]="string"==typeof e?e:a,i[1]=p;for(var c=2;c<o;c++)i[c]=n[c];return r.createElement.apply(null,i)}return r.createElement.apply(null,n)}u.displayName="MDXCreateElement"}}]);