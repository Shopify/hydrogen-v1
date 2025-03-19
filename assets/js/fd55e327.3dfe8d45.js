"use strict";(self.webpackChunkdocs_v_1=self.webpackChunkdocs_v_1||[]).push([[1794],{2815:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>c,contentTitle:()=>i,default:()=>y,frontMatter:()=>o,metadata:()=>p,toc:()=>l});var r=t(8168),a=(t(6540),t(5680));const o={},i="CartLinePrice",p={unversionedId:"components/cart/cartlineprice",id:"components/cart/cartlineprice",title:"CartLinePrice",description:"The CartLinePrice component renders a Money component for the cart line merchandise's price or",source:"@site/docs/components/cart/cartlineprice.md",sourceDirName:"components/cart",slug:"/components/cart/cartlineprice",permalink:"/hydrogen-v1/components/cart/cartlineprice",draft:!1,tags:[],version:"current",frontMatter:{},sidebar:"hydrogen",previous:{title:"CartLineImage",permalink:"/hydrogen-v1/components/cart/cartlineimage"},next:{title:"CartLineProductTitle",permalink:"/hydrogen-v1/components/cart/cartlineproducttitle"}},c={},l=[{value:"Example code",id:"example-code",level:2},{value:"Props",id:"props",level:2},{value:"Component type",id:"component-type",level:2},{value:"Related components",id:"related-components",level:2}],m={toc:l},s="wrapper";function y(e){let{components:n,...t}=e;return(0,a.yg)(s,(0,r.A)({},m,t,{components:n,mdxType:"MDXLayout"}),(0,a.yg)("h1",{id:"cartlineprice"},"CartLinePrice"),(0,a.yg)("p",null,"The ",(0,a.yg)("inlineCode",{parentName:"p"},"CartLinePrice")," component renders a ",(0,a.yg)("inlineCode",{parentName:"p"},"Money")," component for the cart line merchandise's price or\ncompare at price. It must be a descendent of a ",(0,a.yg)("inlineCode",{parentName:"p"},"CartLineProvider")," component."),(0,a.yg)("h2",{id:"example-code"},"Example code"),(0,a.yg)("pre",null,(0,a.yg)("code",{parentName:"pre",className:"language-tsx"},"import {CartLineProvider, useCart, CartLinePrice} from '@shopify/hydrogen';\n\nexport function App() {\n  const {lines} = useCart();\n\n  return lines.map((line) => {\n    return (\n      <CartLineProvider key={line.id} line={line}>\n        <CartLinePrice priceType=\"compareAt\" />\n      </CartLineProvider>\n    );\n  });\n}\n")),(0,a.yg)("h2",{id:"props"},"Props"),(0,a.yg)("table",null,(0,a.yg)("thead",{parentName:"table"},(0,a.yg)("tr",{parentName:"thead"},(0,a.yg)("th",{parentName:"tr",align:null},"Name"),(0,a.yg)("th",{parentName:"tr",align:null},"Type"),(0,a.yg)("th",{parentName:"tr",align:null},"Description"))),(0,a.yg)("tbody",{parentName:"table"},(0,a.yg)("tr",{parentName:"tbody"},(0,a.yg)("td",{parentName:"tr",align:null},"priceType?"),(0,a.yg)("td",{parentName:"tr",align:null},(0,a.yg)("inlineCode",{parentName:"td"},'"regular" &#124; "compareAt"')),(0,a.yg)("td",{parentName:"tr",align:null},"The type of price. Valid values:",(0,a.yg)("inlineCode",{parentName:"td"},"regular")," (default) or ",(0,a.yg)("inlineCode",{parentName:"td"},"compareAt"),".")))),(0,a.yg)("h2",{id:"component-type"},"Component type"),(0,a.yg)("p",null,"The ",(0,a.yg)("inlineCode",{parentName:"p"},"CartLinePrice")," component is a client component, which means that it renders on the client. For more information about component types, refer to ",(0,a.yg)("a",{parentName:"p",href:"https://shopify.dev/custom-storefronts/hydrogen/react-server-components"},"React Server Components"),"."),(0,a.yg)("h2",{id:"related-components"},"Related components"),(0,a.yg)("ul",null,(0,a.yg)("li",{parentName:"ul"},(0,a.yg)("a",{parentName:"li",href:"/components/cart/cartlineprovider/"},(0,a.yg)("inlineCode",{parentName:"a"},"CartLineProvider"))),(0,a.yg)("li",{parentName:"ul"},(0,a.yg)("a",{parentName:"li",href:"/components/primitive/money/"},(0,a.yg)("inlineCode",{parentName:"a"},"Money")))))}y.isMDXComponent=!0},5680:(e,n,t)=>{t.d(n,{xA:()=>m,yg:()=>u});var r=t(6540);function a(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function o(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);n&&(r=r.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,r)}return t}function i(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?o(Object(t),!0).forEach((function(n){a(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):o(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function p(e,n){if(null==e)return{};var t,r,a=function(e,n){if(null==e)return{};var t,r,a={},o=Object.keys(e);for(r=0;r<o.length;r++)t=o[r],n.indexOf(t)>=0||(a[t]=e[t]);return a}(e,n);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)t=o[r],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(a[t]=e[t])}return a}var c=r.createContext({}),l=function(e){var n=r.useContext(c),t=n;return e&&(t="function"==typeof e?e(n):i(i({},n),e)),t},m=function(e){var n=l(e.components);return r.createElement(c.Provider,{value:n},e.children)},s="mdxType",y={inlineCode:"code",wrapper:function(e){var n=e.children;return r.createElement(r.Fragment,{},n)}},d=r.forwardRef((function(e,n){var t=e.components,a=e.mdxType,o=e.originalType,c=e.parentName,m=p(e,["components","mdxType","originalType","parentName"]),s=l(t),d=a,u=s["".concat(c,".").concat(d)]||s[d]||y[d]||o;return t?r.createElement(u,i(i({ref:n},m),{},{components:t})):r.createElement(u,i({ref:n},m))}));function u(e,n){var t=arguments,a=n&&n.mdxType;if("string"==typeof e||a){var o=t.length,i=new Array(o);i[0]=d;var p={};for(var c in n)hasOwnProperty.call(n,c)&&(p[c]=n[c]);p.originalType=e,p[s]="string"==typeof e?e:a,i[1]=p;for(var l=2;l<o;l++)i[l]=t[l];return r.createElement.apply(null,i)}return r.createElement.apply(null,t)}d.displayName="MDXCreateElement"}}]);