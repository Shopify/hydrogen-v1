"use strict";(self.webpackChunkdocs_v_1=self.webpackChunkdocs_v_1||[]).push([[3618],{5443:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>c,contentTitle:()=>i,default:()=>d,frontMatter:()=>o,metadata:()=>l,toc:()=>s});var r=n(8168),a=(n(6540),n(5680));const o={},i="useCartLine",l={unversionedId:"hooks/cart/usecartline",id:"hooks/cart/usecartline",title:"useCartLine",description:"The useCartLine hook provides access to the cart line object. It must be a descendent of a CartProvider component.",source:"@site/docs/hooks/cart/usecartline.md",sourceDirName:"hooks/cart",slug:"/hooks/cart/usecartline",permalink:"/hydrogen-v1/hooks/cart/usecartline",draft:!1,tags:[],version:"current",frontMatter:{},sidebar:"hydrogen",previous:{title:"useCart",permalink:"/hydrogen-v1/hooks/cart/usecart"},next:{title:"useFlashSession",permalink:"/hydrogen-v1/hooks/framework/useflashsession"}},c={},s=[{value:"Example code",id:"example-code",level:2},{value:"Return value",id:"return-value",level:2},{value:"Related components",id:"related-components",level:2}],p={toc:s},u="wrapper";function d(e){let{components:t,...n}=e;return(0,a.yg)(u,(0,r.A)({},p,n,{components:t,mdxType:"MDXLayout"}),(0,a.yg)("h1",{id:"usecartline"},"useCartLine"),(0,a.yg)("p",null,"The ",(0,a.yg)("inlineCode",{parentName:"p"},"useCartLine")," hook provides access to the cart line object. It must be a descendent of a ",(0,a.yg)("inlineCode",{parentName:"p"},"CartProvider")," component."),(0,a.yg)("h2",{id:"example-code"},"Example code"),(0,a.yg)("pre",null,(0,a.yg)("code",{parentName:"pre",className:"language-tsx"},"import {\n  CartLinePrice,\n  CartLineProvider,\n  useCartLine,\n  useCart,\n} from '@shopify/hydrogen';\n\nexport function MyComponent() {\n  const {lines} = useCart();\n\n  return lines.map((line) => {\n    return (\n      <CartLineProvider>\n        <CartLineItem />\n      </CartLineProvider>\n    );\n  });\n}\n\nexport function CartLineItem() {\n  const {\n    quantity,\n    merchandise: {\n      product: { title },\n    },\n  } = useCartLine();\n\n  return (\n    <>\n      <h2>{title}</h2>\n      <span>{quantity}</span>\n      <CartLinePrice as=\"span\" />\n    </>\n  );\n}\n")),(0,a.yg)("h2",{id:"return-value"},"Return value"),(0,a.yg)("p",null,"The ",(0,a.yg)("inlineCode",{parentName:"p"},"useCartLine")," hook returns an object with the following keys:"),(0,a.yg)("table",null,(0,a.yg)("thead",{parentName:"table"},(0,a.yg)("tr",{parentName:"thead"},(0,a.yg)("th",{parentName:"tr",align:null},"Name"),(0,a.yg)("th",{parentName:"tr",align:null},"Description"))),(0,a.yg)("tbody",{parentName:"table"},(0,a.yg)("tr",{parentName:"tbody"},(0,a.yg)("td",{parentName:"tr",align:null},(0,a.yg)("inlineCode",{parentName:"td"},"id")),(0,a.yg)("td",{parentName:"tr",align:null},"The cart line's ID.")),(0,a.yg)("tr",{parentName:"tbody"},(0,a.yg)("td",{parentName:"tr",align:null},(0,a.yg)("inlineCode",{parentName:"td"},"quantity")),(0,a.yg)("td",{parentName:"tr",align:null},"The cart line's quantity.")),(0,a.yg)("tr",{parentName:"tbody"},(0,a.yg)("td",{parentName:"tr",align:null},(0,a.yg)("inlineCode",{parentName:"td"},"attributes")),(0,a.yg)("td",{parentName:"tr",align:null},"The cart line's ",(0,a.yg)("a",{parentName:"td",href:"https://shopify.dev/api/storefront/latest/objects/cartline#field-cartline-attributes"},"attributes"),".")),(0,a.yg)("tr",{parentName:"tbody"},(0,a.yg)("td",{parentName:"tr",align:null},(0,a.yg)("inlineCode",{parentName:"td"},"merchandise")),(0,a.yg)("td",{parentName:"tr",align:null},"The cart line's associated ",(0,a.yg)("a",{parentName:"td",href:"https://shopify.dev/api/storefront/latest/objects/cartline#field-cartline-merchandise"},"merchandise"),".")))),(0,a.yg)("h2",{id:"related-components"},"Related components"),(0,a.yg)("ul",null,(0,a.yg)("li",{parentName:"ul"},(0,a.yg)("a",{parentName:"li",href:"/components/cart/cartprovider/"},(0,a.yg)("inlineCode",{parentName:"a"},"CartLineProvider")))))}d.isMDXComponent=!0},5680:(e,t,n)=>{n.d(t,{xA:()=>p,yg:()=>m});var r=n(6540);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},o=Object.keys(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var c=r.createContext({}),s=function(e){var t=r.useContext(c),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},p=function(e){var t=s(e.components);return r.createElement(c.Provider,{value:t},e.children)},u="mdxType",d={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},y=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,o=e.originalType,c=e.parentName,p=l(e,["components","mdxType","originalType","parentName"]),u=s(n),y=a,m=u["".concat(c,".").concat(y)]||u[y]||d[y]||o;return n?r.createElement(m,i(i({ref:t},p),{},{components:n})):r.createElement(m,i({ref:t},p))}));function m(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=n.length,i=new Array(o);i[0]=y;var l={};for(var c in t)hasOwnProperty.call(t,c)&&(l[c]=t[c]);l.originalType=e,l[u]="string"==typeof e?e:a,i[1]=l;for(var s=2;s<o;s++)i[s]=n[s];return r.createElement.apply(null,i)}return r.createElement.apply(null,n)}y.displayName="MDXCreateElement"}}]);