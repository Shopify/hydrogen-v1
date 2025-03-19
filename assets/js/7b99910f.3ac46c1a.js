"use strict";(self.webpackChunkdocs_v_1=self.webpackChunkdocs_v_1||[]).push([[4326],{782:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>p,contentTitle:()=>l,default:()=>y,frontMatter:()=>i,metadata:()=>o,toc:()=>d});var a=n(8168),r=(n(6540),n(5680));const i={},l="Metafield",o={unversionedId:"components/primitive/metafield",id:"components/primitive/metafield",title:"Metafield",description:"The Metafield component renders the value of a Storefront",source:"@site/docs/components/primitive/metafield.md",sourceDirName:"components/primitive",slug:"/components/primitive/metafield",permalink:"/hydrogen-v1/components/primitive/metafield",draft:!1,tags:[],version:"current",frontMatter:{},sidebar:"hydrogen",previous:{title:"MediaFile",permalink:"/hydrogen-v1/components/primitive/mediafile"},next:{title:"ModelViewer",permalink:"/hydrogen-v1/components/primitive/modelviewer"}},p={},d=[{value:"Example code",id:"example-code",level:2},{value:"Props",id:"props",level:2},{value:"Default output",id:"default-output",level:2},{value:"Required fields",id:"required-fields",level:2},{value:"Component type",id:"component-type",level:2},{value:"Variables",id:"variables",level:3},{value:"Related utilities",id:"related-utilities",level:2}],g={toc:d},m="wrapper";function y(e){let{components:t,...n}=e;return(0,r.yg)(m,(0,a.A)({},g,n,{components:t,mdxType:"MDXLayout"}),(0,r.yg)("h1",{id:"metafield"},"Metafield"),(0,r.yg)("p",null,"The ",(0,r.yg)("inlineCode",{parentName:"p"},"Metafield")," component renders the value of a Storefront\nAPI's ",(0,r.yg)("a",{parentName:"p",href:"https://shopify.dev/api/storefront/reference/common-objects/metafield"},"Metafield object"),"."),(0,r.yg)("p",null,"The component provides a ",(0,r.yg)("a",{parentName:"p",href:"/hydrogen-v1/components/primitive/metafield#default-output"},"default output")," depending on the metafield type. You can ",(0,r.yg)("a",{parentName:"p",href:"/components#customizing-hydrogen-components"},"customize this component")," using passthrough props."),(0,r.yg)("h2",{id:"example-code"},"Example code"),(0,r.yg)("pre",null,(0,r.yg)("code",{parentName:"pre",className:"language-tsx"},"import {Metafield} from '@shopify/hydrogen';\n\nexport function Product({product}) {\n  const metafield = product.metafield;\n\n  return <Metafield data={metafield} />;\n}\n")),(0,r.yg)("h2",{id:"props"},"Props"),(0,r.yg)("table",null,(0,r.yg)("thead",{parentName:"table"},(0,r.yg)("tr",{parentName:"thead"},(0,r.yg)("th",{parentName:"tr",align:null},"Name"),(0,r.yg)("th",{parentName:"tr",align:null},"Type"),(0,r.yg)("th",{parentName:"tr",align:null},"Description"))),(0,r.yg)("tbody",{parentName:"table"},(0,r.yg)("tr",{parentName:"tbody"},(0,r.yg)("td",{parentName:"tr",align:null},"data"),(0,r.yg)("td",{parentName:"tr",align:null},(0,r.yg)("inlineCode",{parentName:"td"},"PartialDeep<<wbr>Metafield<wbr>> &#124; null")),(0,r.yg)("td",{parentName:"tr",align:null},"An object with fields that correspond to the Storefront API's ",(0,r.yg)("a",{parentName:"td",href:"https://shopify.dev/api/storefront/reference/common-objects/metafield"},"Metafield object"),".")),(0,r.yg)("tr",{parentName:"tbody"},(0,r.yg)("td",{parentName:"tr",align:null},"as?"),(0,r.yg)("td",{parentName:"tr",align:null},(0,r.yg)("inlineCode",{parentName:"td"},"TTag")),(0,r.yg)("td",{parentName:"tr",align:null},"An HTML tag to be rendered as the base element wrapper. The default value varies depending on ",(0,r.yg)("a",{parentName:"td",href:"https://shopify.dev/apps/metafields/types"},(0,r.yg)("inlineCode",{parentName:"a"},"metafield.type")),".")))),(0,r.yg)("h2",{id:"default-output"},"Default output"),(0,r.yg)("p",null,"When no ",(0,r.yg)("inlineCode",{parentName:"p"},"children")," prop is provided, the ",(0,r.yg)("inlineCode",{parentName:"p"},"Metafield")," component renders the following defaults:"),(0,r.yg)("table",null,(0,r.yg)("thead",{parentName:"table"},(0,r.yg)("tr",{parentName:"thead"},(0,r.yg)("th",{parentName:"tr",align:null},"Metafield ",(0,r.yg)("inlineCode",{parentName:"th"},"type")),(0,r.yg)("th",{parentName:"tr",align:null},"Output"))),(0,r.yg)("tbody",{parentName:"table"},(0,r.yg)("tr",{parentName:"tbody"},(0,r.yg)("td",{parentName:"tr",align:null},(0,r.yg)("inlineCode",{parentName:"td"},"date")),(0,r.yg)("td",{parentName:"tr",align:null},"A ",(0,r.yg)("inlineCode",{parentName:"td"},"time")," containing the date from ",(0,r.yg)("a",{parentName:"td",href:"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleDateString"},(0,r.yg)("inlineCode",{parentName:"a"},"toLocaleDateString"))," with the shop's locale.")),(0,r.yg)("tr",{parentName:"tbody"},(0,r.yg)("td",{parentName:"tr",align:null},(0,r.yg)("inlineCode",{parentName:"td"},"date_time")),(0,r.yg)("td",{parentName:"tr",align:null},"A ",(0,r.yg)("inlineCode",{parentName:"td"},"time")," containing the date from ",(0,r.yg)("a",{parentName:"td",href:"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleString"},(0,r.yg)("inlineCode",{parentName:"a"},"toLocaleString"))," with the shop's locale.")),(0,r.yg)("tr",{parentName:"tbody"},(0,r.yg)("td",{parentName:"tr",align:null},(0,r.yg)("inlineCode",{parentName:"td"},"boolean")),(0,r.yg)("td",{parentName:"tr",align:null},"A ",(0,r.yg)("inlineCode",{parentName:"td"},"span"),' containing "true" or "false" as a string.')),(0,r.yg)("tr",{parentName:"tbody"},(0,r.yg)("td",{parentName:"tr",align:null},(0,r.yg)("inlineCode",{parentName:"td"},"number_integer")),(0,r.yg)("td",{parentName:"tr",align:null},"A ",(0,r.yg)("inlineCode",{parentName:"td"},"span")," containing the integer.")),(0,r.yg)("tr",{parentName:"tbody"},(0,r.yg)("td",{parentName:"tr",align:null},(0,r.yg)("inlineCode",{parentName:"td"},"number_decimal")),(0,r.yg)("td",{parentName:"tr",align:null},"A ",(0,r.yg)("inlineCode",{parentName:"td"},"span")," containing the number.")),(0,r.yg)("tr",{parentName:"tbody"},(0,r.yg)("td",{parentName:"tr",align:null},(0,r.yg)("inlineCode",{parentName:"td"},"json")),(0,r.yg)("td",{parentName:"tr",align:null},"A ",(0,r.yg)("inlineCode",{parentName:"td"},"span")," containing the JSON object as a string.")),(0,r.yg)("tr",{parentName:"tbody"},(0,r.yg)("td",{parentName:"tr",align:null},(0,r.yg)("inlineCode",{parentName:"td"},"weight")),(0,r.yg)("td",{parentName:"tr",align:null},"A ",(0,r.yg)("inlineCode",{parentName:"td"},"span")," containing a string of the localized weight using ",(0,r.yg)("a",{parentName:"td",href:"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat"},(0,r.yg)("inlineCode",{parentName:"a"},"Intl.NumberFormat")),".")),(0,r.yg)("tr",{parentName:"tbody"},(0,r.yg)("td",{parentName:"tr",align:null},(0,r.yg)("inlineCode",{parentName:"td"},"dimension")),(0,r.yg)("td",{parentName:"tr",align:null},"A ",(0,r.yg)("inlineCode",{parentName:"td"},"span")," containing a string of the localized dimension using ",(0,r.yg)("a",{parentName:"td",href:"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat"},(0,r.yg)("inlineCode",{parentName:"a"},"Intl.NumberFormat")),".")),(0,r.yg)("tr",{parentName:"tbody"},(0,r.yg)("td",{parentName:"tr",align:null},(0,r.yg)("inlineCode",{parentName:"td"},"volume")),(0,r.yg)("td",{parentName:"tr",align:null},"A ",(0,r.yg)("inlineCode",{parentName:"td"},"span")," containing a string of the localized volume using ",(0,r.yg)("a",{parentName:"td",href:"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat"},(0,r.yg)("inlineCode",{parentName:"a"},"Intl.NumberFormat")),".")),(0,r.yg)("tr",{parentName:"tbody"},(0,r.yg)("td",{parentName:"tr",align:null},(0,r.yg)("inlineCode",{parentName:"td"},"rating")),(0,r.yg)("td",{parentName:"tr",align:null},"A ",(0,r.yg)("inlineCode",{parentName:"td"},"span")," containing a string of the rating value.")),(0,r.yg)("tr",{parentName:"tbody"},(0,r.yg)("td",{parentName:"tr",align:null},(0,r.yg)("inlineCode",{parentName:"td"},"color")),(0,r.yg)("td",{parentName:"tr",align:null},"A ",(0,r.yg)("inlineCode",{parentName:"td"},"span")," containing the color value as a string.")),(0,r.yg)("tr",{parentName:"tbody"},(0,r.yg)("td",{parentName:"tr",align:null},(0,r.yg)("inlineCode",{parentName:"td"},"single_line_text_field")),(0,r.yg)("td",{parentName:"tr",align:null},"A ",(0,r.yg)("inlineCode",{parentName:"td"},"span")," component with the text.")),(0,r.yg)("tr",{parentName:"tbody"},(0,r.yg)("td",{parentName:"tr",align:null},(0,r.yg)("inlineCode",{parentName:"td"},"multi_line_text_field")),(0,r.yg)("td",{parentName:"tr",align:null},"A ",(0,r.yg)("inlineCode",{parentName:"td"},"div")," component with the lines of text separated by a ",(0,r.yg)("inlineCode",{parentName:"td"},"<br/>"),".")),(0,r.yg)("tr",{parentName:"tbody"},(0,r.yg)("td",{parentName:"tr",align:null},(0,r.yg)("inlineCode",{parentName:"td"},"product_reference")),(0,r.yg)("td",{parentName:"tr",align:null},"A ",(0,r.yg)("inlineCode",{parentName:"td"},"span")," containing the product reference title. If the title doesn't exist, then the GID is displayed.")),(0,r.yg)("tr",{parentName:"tbody"},(0,r.yg)("td",{parentName:"tr",align:null},(0,r.yg)("inlineCode",{parentName:"td"},"file_reference")),(0,r.yg)("td",{parentName:"tr",align:null},"An ",(0,r.yg)("inlineCode",{parentName:"td"},"Image")," component when the file reference is of type ",(0,r.yg)("inlineCode",{parentName:"td"},"MediaImage"),", a ",(0,r.yg)("inlineCode",{parentName:"td"},"Video")," component when the file reference is of type ",(0,r.yg)("inlineCode",{parentName:"td"},"Video"),", an ",(0,r.yg)("inlineCode",{parentName:"td"},"<a>")," linking to the file with a preview image when the file reference is of type ",(0,r.yg)("inlineCode",{parentName:"td"},"GenericFile"),", or a ",(0,r.yg)("inlineCode",{parentName:"td"},"span")," containing the file reference GID when the file is of another type.")),(0,r.yg)("tr",{parentName:"tbody"},(0,r.yg)("td",{parentName:"tr",align:null},(0,r.yg)("inlineCode",{parentName:"td"},"page_reference")),(0,r.yg)("td",{parentName:"tr",align:null},"A ",(0,r.yg)("inlineCode",{parentName:"td"},"span")," containing the product reference title. If the title doesn't exist, then the GID is displayed.")),(0,r.yg)("tr",{parentName:"tbody"},(0,r.yg)("td",{parentName:"tr",align:null},(0,r.yg)("inlineCode",{parentName:"td"},"variant_reference")),(0,r.yg)("td",{parentName:"tr",align:null},"A ",(0,r.yg)("inlineCode",{parentName:"td"},"span")," containing the product reference title. If the title doesn't exist, then the GID is displayed.")),(0,r.yg)("tr",{parentName:"tbody"},(0,r.yg)("td",{parentName:"tr",align:null},(0,r.yg)("inlineCode",{parentName:"td"},"url")),(0,r.yg)("td",{parentName:"tr",align:null},"An ",(0,r.yg)("inlineCode",{parentName:"td"},"a")," tag with the ",(0,r.yg)("inlineCode",{parentName:"td"},"href")," corresponding to the URL and the label corresponding to the URL.")))),(0,r.yg)("h2",{id:"required-fields"},"Required fields"),(0,r.yg)("p",null,"The ",(0,r.yg)("inlineCode",{parentName:"p"},"Metafield")," component requires fields from the Storefront API's\n",(0,r.yg)("a",{parentName:"p",href:"https://shopify.dev/api/storefront/reference/common-objects/metafield"},"Metafield object")," based on the metafield ",(0,r.yg)("inlineCode",{parentName:"p"},"type"),"."),(0,r.yg)("p",null,"If the metafield ",(0,r.yg)("inlineCode",{parentName:"p"},"type")," is ",(0,r.yg)("inlineCode",{parentName:"p"},"product_reference"),", ",(0,r.yg)("inlineCode",{parentName:"p"},"variant_reference"),", or ",(0,r.yg)("inlineCode",{parentName:"p"},"page_reference"),", then the following fields are required:"),(0,r.yg)("pre",null,(0,r.yg)("code",{parentName:"pre",className:"language-graphql"},"{\n  type\n  reference\n}\n")),(0,r.yg)("p",null,"For all other metafield ",(0,r.yg)("inlineCode",{parentName:"p"},"type"),"s, the following fields are required:"),(0,r.yg)("pre",null,(0,r.yg)("code",{parentName:"pre",className:"language-graphql"},"{\n  type\n  value\n}\n")),(0,r.yg)("h2",{id:"component-type"},"Component type"),(0,r.yg)("p",null,"The ",(0,r.yg)("inlineCode",{parentName:"p"},"Metafield")," component is a client component, which means that it renders on the client. For more information about component types, refer to ",(0,r.yg)("a",{parentName:"p",href:"https://shopify.dev/custom-storefronts/hydrogen/react-server-components"},"React Server Components"),"."),(0,r.yg)("h3",{id:"variables"},"Variables"),(0,r.yg)("p",null,"The ",(0,r.yg)("a",{parentName:"p",href:"https://shopify.dev/api/storefront/reference/common-objects/metafield"},"Metafield object")," includes variables that you will need to provide values for when performing your query."),(0,r.yg)("table",null,(0,r.yg)("thead",{parentName:"table"},(0,r.yg)("tr",{parentName:"thead"},(0,r.yg)("th",{parentName:"tr",align:null},"Variable"),(0,r.yg)("th",{parentName:"tr",align:null},"Description"))),(0,r.yg)("tbody",{parentName:"table"},(0,r.yg)("tr",{parentName:"tbody"},(0,r.yg)("td",{parentName:"tr",align:null},(0,r.yg)("inlineCode",{parentName:"td"},"$includeReferenceMetafieldDetails")),(0,r.yg)("td",{parentName:"tr",align:null},"A boolean indicating if the reference type should be queried. Only applicable to ",(0,r.yg)("inlineCode",{parentName:"td"},"file_reference"),", ",(0,r.yg)("inlineCode",{parentName:"td"},"product_reference"),", ",(0,r.yg)("inlineCode",{parentName:"td"},"variant_reference"),", and ",(0,r.yg)("inlineCode",{parentName:"td"},"page_reference")," metafield types.")))),(0,r.yg)("h2",{id:"related-utilities"},"Related utilities"),(0,r.yg)("ul",null,(0,r.yg)("li",{parentName:"ul"},(0,r.yg)("a",{parentName:"li",href:"/utilities/parsemetafield/"},(0,r.yg)("inlineCode",{parentName:"a"},"parseMetafield"))),(0,r.yg)("li",{parentName:"ul"},(0,r.yg)("a",{parentName:"li",href:"/utilities/parsemetafieldvalue/"},(0,r.yg)("inlineCode",{parentName:"a"},"parseMetafieldValue")))))}y.isMDXComponent=!0},5680:(e,t,n)=>{n.d(t,{xA:()=>g,yg:()=>c});var a=n(6540);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function l(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function o(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},i=Object.keys(e);for(a=0;a<i.length;a++)n=i[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(a=0;a<i.length;a++)n=i[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var p=a.createContext({}),d=function(e){var t=a.useContext(p),n=t;return e&&(n="function"==typeof e?e(t):l(l({},t),e)),n},g=function(e){var t=d(e.components);return a.createElement(p.Provider,{value:t},e.children)},m="mdxType",y={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},s=a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,i=e.originalType,p=e.parentName,g=o(e,["components","mdxType","originalType","parentName"]),m=d(n),s=r,c=m["".concat(p,".").concat(s)]||m[s]||y[s]||i;return n?a.createElement(c,l(l({ref:t},g),{},{components:n})):a.createElement(c,l({ref:t},g))}));function c(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var i=n.length,l=new Array(i);l[0]=s;var o={};for(var p in t)hasOwnProperty.call(t,p)&&(o[p]=t[p]);o.originalType=e,o[m]="string"==typeof e?e:r,l[1]=o;for(var d=2;d<i;d++)l[d]=n[d];return a.createElement.apply(null,l)}return a.createElement.apply(null,n)}s.displayName="MDXCreateElement"}}]);