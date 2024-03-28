"use strict";(self.webpackChunkdocs_v_1=self.webpackChunkdocs_v_1||[]).push([[8486],{5680:(e,n,t)=>{t.d(n,{xA:()=>s,yg:()=>g});var i=t(6540);function r(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function o(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);n&&(i=i.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,i)}return t}function a(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?o(Object(t),!0).forEach((function(n){r(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):o(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function d(e,n){if(null==e)return{};var t,i,r=function(e,n){if(null==e)return{};var t,i,r={},o=Object.keys(e);for(i=0;i<o.length;i++)t=o[i],n.indexOf(t)>=0||(r[t]=e[t]);return r}(e,n);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(i=0;i<o.length;i++)t=o[i],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(r[t]=e[t])}return r}var l=i.createContext({}),p=function(e){var n=i.useContext(l),t=n;return e&&(t="function"==typeof e?e(n):a(a({},n),e)),t},s=function(e){var n=p(e.components);return i.createElement(l.Provider,{value:n},e.children)},c="mdxType",u={inlineCode:"code",wrapper:function(e){var n=e.children;return i.createElement(i.Fragment,{},n)}},y=i.forwardRef((function(e,n){var t=e.components,r=e.mdxType,o=e.originalType,l=e.parentName,s=d(e,["components","mdxType","originalType","parentName"]),c=p(t),y=r,g=c["".concat(l,".").concat(y)]||c[y]||u[y]||o;return t?i.createElement(g,a(a({ref:n},s),{},{components:t})):i.createElement(g,a({ref:n},s))}));function g(e,n){var t=arguments,r=n&&n.mdxType;if("string"==typeof e||r){var o=t.length,a=new Array(o);a[0]=y;var d={};for(var l in n)hasOwnProperty.call(n,l)&&(d[l]=n[l]);d.originalType=e,d[c]="string"==typeof e?e:r,a[1]=d;for(var p=2;p<o;p++)a[p]=t[p];return i.createElement.apply(null,a)}return i.createElement.apply(null,t)}y.displayName="MDXCreateElement"},6498:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>l,contentTitle:()=>a,default:()=>u,frontMatter:()=>o,metadata:()=>d,toc:()=>p});var i=t(8168),r=(t(6540),t(5680));const o={},a="Third-party dependencies",d={unversionedId:"tutorials/third-party-dependencies",id:"tutorials/third-party-dependencies",title:"Third-party dependencies",description:"Hydrogen 2.0 is out now. These archival Hydrogen 1.0 docs are provided only to assist developers during their upgrade process. Please migrate to Hydrogen 2.0 as soon as possible.",source:"@site/docs/tutorials/third-party-dependencies.md",sourceDirName:"tutorials",slug:"/tutorials/third-party-dependencies",permalink:"/hydrogen-v1/tutorials/third-party-dependencies",draft:!1,tags:[],version:"current",frontMatter:{},sidebar:"hydrogen",previous:{title:"Streaming server-side rendering (SSR)",permalink:"/hydrogen-v1/tutorials/streaming-ssr"},next:{title:"API reference",permalink:"/hydrogen-v1/api"}},l={},p=[{value:"Installation",id:"installation",level:2},{value:"Where to insert dependencies",id:"where-to-insert-dependencies",level:2},{value:"Troubleshooting dependencies",id:"troubleshooting-dependencies",level:2},{value:"Updating Vite dependencies",id:"updating-vite-dependencies",level:3},{value:"Bundling third-party dependencies",id:"bundling-third-party-dependencies",level:3},{value:"Next steps",id:"next-steps",level:2}],s={toc:p},c="wrapper";function u(e){let{components:n,...t}=e;return(0,r.yg)(c,(0,i.A)({},s,t,{components:n,mdxType:"MDXLayout"}),(0,r.yg)("h1",{id:"third-party-dependencies"},"Third-party dependencies"),(0,r.yg)("admonition",{type:"tip"},(0,r.yg)("p",{parentName:"admonition"},"Hydrogen 2.0 is out now. These archival Hydrogen 1.0 docs are provided only to assist developers during their upgrade process. Please ",(0,r.yg)("a",{parentName:"p",href:"https://shopify.dev/docs/custom-storefronts/hydrogen/migrate-hydrogen-remix"},"migrate to Hydrogen 2.0")," as soon as possible.")),(0,r.yg)("p",null,"Third-party dependencies will generally work out-of-the-box with Hydrogen. This guide describes how to install third-party dependencies, where to insert them, and offers tips for troubleshooting dependencies."),(0,r.yg)("h2",{id:"installation"},"Installation"),(0,r.yg)("p",null,"To install third party dependencies, run the following command:"),(0,r.yg)("pre",null,(0,r.yg)("code",{parentName:"pre",className:"language-bash?title:",metastring:"'npm'","'npm'":!0},"\nnpm install <dependency>\n")),(0,r.yg)("pre",null,(0,r.yg)("code",{parentName:"pre",className:"language-bash?title:",metastring:"'Yarn'","'Yarn'":!0},"yarn add <dependency>\n")),(0,r.yg)("h2",{id:"where-to-insert-dependencies"},"Where to insert dependencies"),(0,r.yg)("p",null,"Consider the following:"),(0,r.yg)("ul",null,(0,r.yg)("li",{parentName:"ul"},"If the dependency interacts with ",(0,r.yg)("inlineCode",{parentName:"li"},"useState")," or browser APIs, then place it inside a ",(0,r.yg)("inlineCode",{parentName:"li"},"*.client.jsx")," component. Follow the ",(0,r.yg)("a",{parentName:"li",href:"/hydrogen-v1/tutorials/react-server-components/#constraints"},"rules of server and client components"),"."),(0,r.yg)("li",{parentName:"ul"},"If the dependency is purely client-based, and you don't need to interact with it in individual components, then you can insert it in the ",(0,r.yg)("inlineCode",{parentName:"li"},"<head>")," element of ",(0,r.yg)("inlineCode",{parentName:"li"},"index.html"),"."),(0,r.yg)("li",{parentName:"ul"},"If the dependency includes a style import from a CSS file, then you can import that in the ",(0,r.yg)("inlineCode",{parentName:"li"},"<head>")," element of ",(0,r.yg)("inlineCode",{parentName:"li"},"index.html"),".")),(0,r.yg)("h2",{id:"troubleshooting-dependencies"},"Troubleshooting dependencies"),(0,r.yg)("p",null,"This section provides strategies for troubleshooting third-party dependencies in your Hydrogen project."),(0,r.yg)("h3",{id:"updating-vite-dependencies"},"Updating Vite dependencies"),(0,r.yg)("p",null,(0,r.yg)("a",{parentName:"p",href:"https://vitejs.dev/"},"Vite")," caches pre-bundled dependencies in ",(0,r.yg)("inlineCode",{parentName:"p"},"node_modules/.vite"),". It re-runs the pre-bundling step if any of the following changes occur:"),(0,r.yg)("ul",null,(0,r.yg)("li",{parentName:"ul"},"The dependencies list is updated in ",(0,r.yg)("inlineCode",{parentName:"li"},"package.json")),(0,r.yg)("li",{parentName:"ul"},"Package manager lockfiles (for example ",(0,r.yg)("inlineCode",{parentName:"li"},"yarn.lock"),") are updated"),(0,r.yg)("li",{parentName:"ul"},"Any fields in ",(0,r.yg)("inlineCode",{parentName:"li"},"vite.config.js")," are updated")),(0,r.yg)("p",null,"You can force Vite to re-bundle dependencies by completing one of the following tasks:"),(0,r.yg)("ul",null,(0,r.yg)("li",{parentName:"ul"},"Start the dev server with the ",(0,r.yg)("inlineCode",{parentName:"li"},"--force")," command line option"),(0,r.yg)("li",{parentName:"ul"},"Manually delete the ",(0,r.yg)("inlineCode",{parentName:"li"},"node_modules/.vite")," cache directory")),(0,r.yg)("h3",{id:"bundling-third-party-dependencies"},"Bundling third-party dependencies"),(0,r.yg)("p",null,"When bundling third-party dependencies, you might see errors in development or production related to the incorrect bundle type being used from the package."),(0,r.yg)("p",null,"This happens because ",(0,r.yg)("a",{parentName:"p",href:"https://vitejs.dev/"},"Vite")," uses a heuristic to determine whether to load a module-based import (ESM) or a CommonJS-based import (CJS). Sometimes, the heuristic chooses the wrong version, or the third-party package formats their project in an unusual way."),(0,r.yg)("p",null,"To fix this, you can try adding the dependency to the ",(0,r.yg)("inlineCode",{parentName:"p"},"optimizeDeps.include")," property of your ",(0,r.yg)("inlineCode",{parentName:"p"},"vite.config.js")," file:"),(0,r.yg)("pre",null,(0,r.yg)("code",{parentName:"pre",className:"language-js"},"// vite.config.js\n\nimport {defineConfig} from 'vite';\nimport hydrogen from '@shopify/hydrogen/plugin';\n\n// https://vitejs.dev/config/\nexport default defineConfig({\n  plugins: [hydrogen()],\n\n  optimizeDeps: {\n    include: ['YOUR_DEPENDENCY'],\n  },\n});\n")),(0,r.yg)("blockquote",null,(0,r.yg)("p",{parentName:"blockquote"},"Tip:\nIf you find that a dependency is being optimized when it shouldn't, then you can try adding the dependency to ",(0,r.yg)("inlineCode",{parentName:"p"},"optimizeDeps.exclude")," to see if it fixes the issue.")),(0,r.yg)("h2",{id:"next-steps"},"Next steps"),(0,r.yg)("ul",null,(0,r.yg)("li",{parentName:"ul"},"Learn more about dependency pre-bundling and optimization in ",(0,r.yg)("a",{parentName:"li",href:"https://vitejs.dev/guide/dep-pre-bundling.html#dependency-pre-bundling"},"Vite"),"."),(0,r.yg)("li",{parentName:"ul"},(0,r.yg)("a",{parentName:"li",href:"https://github.com/Shopify/hydrogen/discussions/93"},"Check the Hydrogen GitHub discussion")," for your issue, or report a new issue to Hydrogen maintainers.")))}u.isMDXComponent=!0}}]);