"use strict";(self.webpackChunkdocs_v_1=self.webpackChunkdocs_v_1||[]).push([[4733],{5680:(e,n,r)=>{r.d(n,{xA:()=>d,yg:()=>c});var t=r(6540);function o(e,n,r){return n in e?Object.defineProperty(e,n,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[n]=r,e}function a(e,n){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var t=Object.getOwnPropertySymbols(e);n&&(t=t.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),r.push.apply(r,t)}return r}function l(e){for(var n=1;n<arguments.length;n++){var r=null!=arguments[n]?arguments[n]:{};n%2?a(Object(r),!0).forEach((function(n){o(e,n,r[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):a(Object(r)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(r,n))}))}return e}function i(e,n){if(null==e)return{};var r,t,o=function(e,n){if(null==e)return{};var r,t,o={},a=Object.keys(e);for(t=0;t<a.length;t++)r=a[t],n.indexOf(r)>=0||(o[r]=e[r]);return o}(e,n);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(t=0;t<a.length;t++)r=a[t],n.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(o[r]=e[r])}return o}var s=t.createContext({}),p=function(e){var n=t.useContext(s),r=n;return e&&(r="function"==typeof e?e(n):l(l({},n),e)),r},d=function(e){var n=p(e.components);return t.createElement(s.Provider,{value:n},e.children)},y="mdxType",u={inlineCode:"code",wrapper:function(e){var n=e.children;return t.createElement(t.Fragment,{},n)}},g=t.forwardRef((function(e,n){var r=e.components,o=e.mdxType,a=e.originalType,s=e.parentName,d=i(e,["components","mdxType","originalType","parentName"]),y=p(r),g=o,c=y["".concat(s,".").concat(g)]||y[g]||u[g]||a;return r?t.createElement(c,l(l({ref:n},d),{},{components:r})):t.createElement(c,l({ref:n},d))}));function c(e,n){var r=arguments,o=n&&n.mdxType;if("string"==typeof e||o){var a=r.length,l=new Array(a);l[0]=g;var i={};for(var s in n)hasOwnProperty.call(n,s)&&(i[s]=n[s]);i.originalType=e,i[y]="string"==typeof e?e:o,l[1]=i;for(var p=2;p<a;p++)l[p]=r[p];return t.createElement.apply(null,l)}return t.createElement.apply(null,r)}g.displayName="MDXCreateElement"},3367:(e,n,r)=>{r.r(n),r.d(n,{assets:()=>s,contentTitle:()=>l,default:()=>u,frontMatter:()=>a,metadata:()=>i,toc:()=>p});var t=r(8168),o=(r(6540),r(5680));const a={},l="Deploy a Hydrogen storefront",i={unversionedId:"tutorials/deployment",id:"tutorials/deployment",title:"Deploy a Hydrogen storefront",description:"Hydrogen 2.0 is out now. These archival Hydrogen 1.0 docs are provided only to assist developers during their upgrade process. Please migrate to Hydrogen 2.0 as soon as possible.",source:"@site/docs/tutorials/deployment.md",sourceDirName:"tutorials",slug:"/tutorials/deployment",permalink:"/hydrogen-v1/tutorials/deployment",draft:!1,tags:[],version:"current",frontMatter:{},sidebar:"hydrogen",previous:{title:"Work with third-party data",permalink:"/hydrogen-v1/tutorials/data-sources/work-with-3p-data-sources"},next:{title:"ESLint",permalink:"/hydrogen-v1/tutorials/eslint"}},s={},p=[{value:"Requirements",id:"requirements",level:2},{value:"Deploy to Oxygen",id:"deploy-to-oxygen",level:2},{value:"Deploy to Netlify",id:"deploy-to-netlify",level:2},{value:"Deploy to Vercel",id:"deploy-to-vercel",level:2},{value:"Deploy to Node.js",id:"deploy-to-nodejs",level:2},{value:"Apply extra middleware",id:"apply-extra-middleware",level:3},{value:"Use a different Node.js framework",id:"use-a-different-nodejs-framework",level:3},{value:"Use <code>App.server.jsx</code> as the server entry point",id:"use-appserverjsx-as-the-server-entry-point",level:3},{value:"Deploy to Docker",id:"deploy-to-docker",level:2},{value:"Deploy to Cloudflare Workers",id:"deploy-to-cloudflare-workers",level:2},{value:"Avoid rate limiting in production",id:"avoid-rate-limiting-in-production",level:2}],d={toc:p},y="wrapper";function u(e){let{components:n,...r}=e;return(0,o.yg)(y,(0,t.A)({},d,r,{components:n,mdxType:"MDXLayout"}),(0,o.yg)("h1",{id:"deploy-a-hydrogen-storefront"},"Deploy a Hydrogen storefront"),(0,o.yg)("admonition",{type:"tip"},(0,o.yg)("p",{parentName:"admonition"},"Hydrogen 2.0 is out now. These archival Hydrogen 1.0 docs are provided only to assist developers during their upgrade process. Please ",(0,o.yg)("a",{parentName:"p",href:"https://shopify.dev/docs/custom-storefronts/hydrogen/migrate-hydrogen-remix"},"migrate to Hydrogen 2.0")," as soon as possible.")),(0,o.yg)("p",null,"You can deploy a Hydrogen storefront to most ",(0,o.yg)("a",{parentName:"p",href:"https://shopify.dev/docs/custom-storefronts/hydrogen#request-workflow-for-hydrogen-apps"},"Worker and Node.js runtimes"),". This guide describes how to deploy a Hydrogen storefront to ",(0,o.yg)("a",{parentName:"p",href:"#deploy-to-oxygen"},"Oxygen"),", ",(0,o.yg)("a",{parentName:"p",href:"#deploy-to-netlify"},"Netlify"),", ",(0,o.yg)("a",{parentName:"p",href:"#deploy-to-vercel"},"Vercel"),", ",(0,o.yg)("a",{parentName:"p",href:"#deploy-to-node-js"},"Node.js"),", ",(0,o.yg)("a",{parentName:"p",href:"#deploy-to-docker"},"Docker"),", and ",(0,o.yg)("a",{parentName:"p",href:"#deploy-to-cloudflare-workers"},"Cloudflare Workers"),"."),(0,o.yg)("h2",{id:"requirements"},"Requirements"),(0,o.yg)("ul",null,(0,o.yg)("li",{parentName:"ul"},(0,o.yg)("p",{parentName:"li"},"You're using the ",(0,o.yg)("a",{parentName:"p",href:"https://github.com/Shopify/hydrogen/releases"},"most recent version of Hydrogen"),". The latest release gives you the benefits of performance enhancements, new components, and other best practices.")),(0,o.yg)("li",{parentName:"ul"},(0,o.yg)("p",{parentName:"li"},"If you're deploying to a non-Oxygen runtime, then you've retrieved a ",(0,o.yg)("a",{parentName:"p",href:"#avoid-rate-limiting-in-production"},"delegate access token for server requests")," and stored it in a private variable."))),(0,o.yg)("h2",{id:"deploy-to-oxygen"},"Deploy to Oxygen"),(0,o.yg)("p",null,"Oxygen is Shopify's recommended deployment platform for Hydrogen storefronts. To learn how to deploy a Hydrogen storefront to Oxygen, refer to ",(0,o.yg)("a",{parentName:"p",href:"https://shopify.dev/docs/custom-storefronts/oxygen/getting-started"},"Getting started with Oxygen"),"."),(0,o.yg)("h2",{id:"deploy-to-netlify"},"Deploy to Netlify"),(0,o.yg)("p",null,"To learn how to deploy your Hydrogen storefront to Netlify, refer to the ",(0,o.yg)("a",{parentName:"p",href:"https://docs.netlify.com/integrations/frameworks/hydrogen/"},"Hydrogen on Netlify")," documentation."),(0,o.yg)("h2",{id:"deploy-to-vercel"},"Deploy to Vercel"),(0,o.yg)("p",null,"To learn how to deploy your Hydrogen storefront to Vercel Edge Functions, refer to the ",(0,o.yg)("a",{parentName:"p",href:"https://vercel.com/new/clone?s=https%3A%2F%2Fgithub.com%2Fvercel%2Fvercel%2Ftree%2Fmain%2Fexamples%2Fhydrogen&template=hydrogen"},"Vercel Hydrogen template")," documentation."),(0,o.yg)("h2",{id:"deploy-to-nodejs"},"Deploy to Node.js"),(0,o.yg)("p",null,"By default, Hydrogen targets a Workers runtime like Oxygen. However, you can also deploy your Hydrogen storefront to ",(0,o.yg)("a",{parentName:"p",href:"https://nodejs.org/en/"},"Node.js"),", an open-source JavaScript runtime environment."),(0,o.yg)("p",null,"Hydrogen provides a ",(0,o.yg)("a",{parentName:"p",href:"https://github.com/Shopify/hydrogen/blob/main/packages/hydrogen/src/platforms/node.ts"},"built-in Node entrypoint")," which suits basic production use cases. You can run and preview your Hydrogen storefront in Node.js by building your Hydrogen storefront for production and previewing the app locally:"),(0,o.yg)("pre",null,(0,o.yg)("code",{parentName:"pre",className:"language-bash"},"\n\nyarn build --target node\n\nyarn preview --target node\n")),(0,o.yg)("p",null,"The production version of your app will be running at http://localhost:3000. You can inspect and deploy the compiled version of your Node.js Hydrogen storefront from ",(0,o.yg)("inlineCode",{parentName:"p"},"dist/node"),"."),(0,o.yg)("h3",{id:"apply-extra-middleware"},"Apply extra middleware"),(0,o.yg)("p",null,"If you're using the default server entry point in the ",(0,o.yg)("inlineCode",{parentName:"p"},"build --target node")," script (",(0,o.yg)("inlineCode",{parentName:"p"},"@shopify/hydrogen/platforms/node"),"), then the generated server bundle (",(0,o.yg)("inlineCode",{parentName:"p"},"dist/node/index.js"),") consists of a simple Node.js server that uses ",(0,o.yg)("a",{parentName:"p",href:"https://github.com/senchalabs/connect"},"Connect")," middleware."),(0,o.yg)("p",null,"This bundle also exports the ",(0,o.yg)("inlineCode",{parentName:"p"},"createServer")," function, which you can call programmatically to apply extra middleware:"),(0,o.yg)("pre",null,(0,o.yg)("code",{parentName:"pre",className:"language-js"},"// server.js\n\nconst {createServer} = require('./dist/node');\n\n// This function accepts an optional\n// `cache` instance parameter: https://developer.mozilla.org/en-US/docs/Web/API/Cache.\ncreateServer({\n  cache: customCacheImplementation,\n}).then(({app}) => {\n  app.use(/* ... */);\n\n  app.listen(3000, () => {\n    console.log(`Server ready`);\n  });\n});\n")),(0,o.yg)("h3",{id:"use-a-different-nodejs-framework"},"Use a different Node.js framework"),(0,o.yg)("p",null,"If you want to use a different Node.js framework like ",(0,o.yg)("a",{parentName:"p",href:"https://expressjs.com/"},"Express")," or ",(0,o.yg)("a",{parentName:"p",href:"https://www.fastify.io/"},"Fastify"),", then complete the following steps:"),(0,o.yg)("ol",null,(0,o.yg)("li",{parentName:"ol"},(0,o.yg)("p",{parentName:"li"},"Create a new server entry point (for example, ",(0,o.yg)("inlineCode",{parentName:"p"},"server.js"),") and import ",(0,o.yg)("inlineCode",{parentName:"p"},"hydrogenMiddleware"),":"),(0,o.yg)("pre",{parentName:"li"},(0,o.yg)("code",{parentName:"pre",className:"language-js"},"// server.js\n\nimport {hydrogenMiddleware} from '@shopify/hydrogen/middleware';\nimport serveStatic from 'serve-static';\nimport compression from 'compression';\nimport bodyParser from 'body-parser';\nimport connect from 'connect';\nimport path from 'path';\n\nconst port = process.env.PORT || 8080;\n\n// Initialize your own server framework like connect\nconst app = connect();\n\n// Add desired middlewares and handle static assets\napp.use(compression());\napp.use(serveStatic(path.resolve(__dirname, '../', 'client'), {index: false}));\napp.use(bodyParser.raw({type: '*/*'}));\n\napp.use(\n  '*',\n  hydrogenMiddleware({\n    getServerEntrypoint: () => import('./src/App.server'),\n    indexTemplate: () => import('./dist/client/index.html?raw'),\n    // Optional: Provide a custom strategy for caching in production. Defaults to in-memory.\n    cache: customCacheImplementation,\n  })\n);\n\napp.listen(port, () => {\n  console.log(`Hydrogen server running at http://localhost:${port}`);\n});\n")))),(0,o.yg)("ol",{start:2},(0,o.yg)("li",{parentName:"ol"},"Use the new file as the entry point for your build command. For example, if the script is located in ",(0,o.yg)("inlineCode",{parentName:"li"},"<root>/server.js"),", then you would run the following command:")),(0,o.yg)("pre",null,(0,o.yg)("code",{parentName:"pre"},"```bash\n\nyarn build --entry server --target node\n```\n")),(0,o.yg)("ol",{start:3},(0,o.yg)("li",{parentName:"ol"},"Preview the server bundle:")),(0,o.yg)("pre",null,(0,o.yg)("code",{parentName:"pre"},"```bash?title: 'Yarn'\nyarn preview --target node\n```\n\n```bash?title: 'node'\nnode dist/node\n```\n")),(0,o.yg)("h3",{id:"use-appserverjsx-as-the-server-entry-point"},"Use ",(0,o.yg)("inlineCode",{parentName:"h3"},"App.server.jsx")," as the server entry point"),(0,o.yg)("p",null,"If your server isn't compatible with ",(0,o.yg)("a",{parentName:"p",href:"https://github.com/senchalabs/connect"},"Connect")," middleware or you're deploying to a serverless platform, then you can directly use the ",(0,o.yg)("inlineCode",{parentName:"p"},"App.server.jsx")," file as the server entry point."),(0,o.yg)("p",null,"Update the scripts in ",(0,o.yg)("inlineCode",{parentName:"p"},"package.json")," to specify your new entry point:"),(0,o.yg)("pre",null,(0,o.yg)("code",{parentName:"pre",className:"language-json"},'// Remove this line\n- "build": "shopify hydrogen build",\n\n// Add this line\n+ "build": "shopify hydrogen build --entry src/App.server --target node",\n')),(0,o.yg)("p",null,"This exposes a ",(0,o.yg)("inlineCode",{parentName:"p"},"handleRequest")," function that can be imported in your server or serverless function:"),(0,o.yg)("pre",null,(0,o.yg)("code",{parentName:"pre",className:"language-js"},"// server.js\n\n// Polyfill Web APIs like `fetch` and `ReadableStream`\nrequire('@shopify/hydrogen/web-polyfills');\n\nconst fs = require('fs');\nconst handleRequest = require('./dist/node');\n\nconst indexTemplate = fs.readFileSync('./dist/client/index.html', 'utf-8');\n\nmodule.exports = function (request, response) {\n  handleRequest(request, {\n    indexTemplate,\n    streamableResponse: response,\n  });\n};\n")),(0,o.yg)("h2",{id:"deploy-to-docker"},"Deploy to Docker"),(0,o.yg)("p",null,"You can deploy your project to any platform that supports Docker-based hosting, like ",(0,o.yg)("a",{parentName:"p",href:"https://cloud.google.com/run"},"Google Cloud Run"),", ",(0,o.yg)("a",{parentName:"p",href:"https://fly.io/"},"Fly.io"),", and ",(0,o.yg)("a",{parentName:"p",href:"https://heroku.com/"},"Heroku"),". If you've ",(0,o.yg)("a",{parentName:"p",href:"#deploy-to-node-js"},"generated a Node.js server"),", then you can run it inside a Docker container."),(0,o.yg)("ol",null,(0,o.yg)("li",{parentName:"ol"},(0,o.yg)("p",{parentName:"li"},"Install ",(0,o.yg)("a",{parentName:"p",href:"https://www.docker.com/"},"Docker"),".")),(0,o.yg)("li",{parentName:"ol"},(0,o.yg)("p",{parentName:"li"},"Add a Docker file to the root of your project:"),(0,o.yg)("pre",{parentName:"li"},(0,o.yg)("code",{parentName:"pre",className:"language-dockerfile"},'FROM node:16 AS build-env\nADD . /app\n\nWORKDIR /app\nRUN yarn\nRUN yarn build --target node\n\nFROM gcr.io/distroless/nodejs:16 AS run-env\nENV NODE_ENV production\nCOPY --from=build-env /app /app\n\nEXPOSE ${PORT:-8080}\n\nWORKDIR /app\nCMD ["dist/node/index.js"]\n')))),(0,o.yg)("ol",null,(0,o.yg)("li",{parentName:"ol"},"Run Docker inside your app directory by executing the following commands:")),(0,o.yg)("pre",null,(0,o.yg)("code",{parentName:"pre"},"```bash\ndocker build . --tag hydrogen-sample-app:latest\n\ndocker run -d -p 8080:8080 hydrogen-sample-app\n```\n\n\n\nThe production version of your app will be running at http://localhost:8080.\n")),(0,o.yg)("h2",{id:"deploy-to-cloudflare-workers"},"Deploy to Cloudflare Workers"),(0,o.yg)("p",null,"You can deploy your Hydrogen storefront to Cloudflare Workers, a serverless application platform. For the Cloudflare Workers' Cache API to work, you need to meet the following requirements:"),(0,o.yg)("ul",null,(0,o.yg)("li",{parentName:"ul"},"You have a Cloudflare domain. The domain can't be ",(0,o.yg)("inlineCode",{parentName:"li"},"worker.dev"),", because Cloudflare owns this domain."),(0,o.yg)("li",{parentName:"ul"},"You have a DNS record for the Cloudflare domain. For example, ",(0,o.yg)("inlineCode",{parentName:"li"},"A example.dev 192.0.2.1 Proxied"),"."),(0,o.yg)("li",{parentName:"ul"},"You have a worker route that points to the Cloudflare domain.")),(0,o.yg)("blockquote",null,(0,o.yg)("p",{parentName:"blockquote"},"Note:\nRequirements might be different for Cloudflare enterprise accounts.")),(0,o.yg)("ol",null,(0,o.yg)("li",{parentName:"ol"},(0,o.yg)("p",{parentName:"li"},(0,o.yg)("a",{parentName:"p",href:"/tutorials/getting-started/quickstart/"},"Create a Hydrogen storefront locally"),".")),(0,o.yg)("li",{parentName:"ol"},(0,o.yg)("p",{parentName:"li"},"Create a ",(0,o.yg)("inlineCode",{parentName:"p"},"wrangler.toml")," file in the root of your project."),(0,o.yg)("p",{parentName:"li"},"For more information about the configurable properties in the ",(0,o.yg)("inlineCode",{parentName:"p"},"wrangler.toml")," file, refer to Cloudflare's ",(0,o.yg)("a",{parentName:"p",href:"https://developers.cloudflare.com/workers/cli-wrangler/configuration"},"configuration")," and ",(0,o.yg)("a",{parentName:"p",href:"https://developers.cloudflare.com/workers/platform/compatibility-dates"},"compatibility dates")," documentation."),(0,o.yg)("pre",{parentName:"li"},(0,o.yg)("code",{parentName:"pre",className:"language-toml"},'# wrangler.toml\n\naccount_id = ""\ncompatibility_date = "2022-01-28"\ncompatibility_flags = ["streams_enable_constructors"]\nmain = "dist/worker/index.js"\nname = "PROJECT_NAME"\nroute = ""\nworkers_dev = true\n\n[site]\nbucket = "dist/client"\n\n[build]\ncommand = "yarn && yarn build"\n')))),(0,o.yg)("pre",null,(0,o.yg)("code",{parentName:"pre"},"Your static files are now uploaded to Workers KV.\n")),(0,o.yg)("ol",null,(0,o.yg)("li",{parentName:"ol"},(0,o.yg)("p",{parentName:"li"},"Install Cloudflare's KV asset handler:"),(0,o.yg)("pre",{parentName:"li"},(0,o.yg)("code",{parentName:"pre",className:"language-bash"},"npm install @cloudflare/kv-asset-handler\n"))),(0,o.yg)("li",{parentName:"ol"},(0,o.yg)("p",{parentName:"li"},"Create a new Worker entry file (for example, ",(0,o.yg)("inlineCode",{parentName:"p"},"worker.js"),") in your project:"),(0,o.yg)("pre",{parentName:"li"},(0,o.yg)("code",{parentName:"pre",className:"language-js"},"// worker.js\n\n// If the request path matches any of your assets, then use the `getAssetFromKV`\n// function from `@cloudflare/kv-asset-handler` to serve it. Otherwise, call the\n// `handleRequest` function, which is imported from your `App.server.jsx` file,\n// to return a Hydrogen response.\nimport {getAssetFromKV} from '@cloudflare/kv-asset-handler';\nimport handleRequest from './src/App.server';\nimport indexTemplate from './dist/client/index.html?raw';\n\nfunction isAsset(url) {\n  // Update this RE to fit your assets\n  return /\\.(png|jpe?g|gif|css|js|svg|ico|map)$/i.test(url.pathname);\n}\n\nasync function handleAsset(url, event) {\n  const response = await getAssetFromKV(event, {});\n\n  // Custom cache-control for assets\n  if (response.status < 400) {\n    const filename = url.pathname.split('/').pop();\n\n    const maxAge =\n      filename.split('.').length > 2\n        ? 31536000 // hashed asset, will never be updated\n        : 86400; // favicon and other public assets\n\n    response.headers.append('cache-control', `public, max-age=${maxAge}`);\n  }\n\n  return response;\n}\n\nasync function handleEvent(event) {\n  try {\n    const url = new URL(event.request.url);\n\n    if (isAsset(url)) {\n      return await handleAsset(url, event);\n    }\n\n    return await handleRequest(event.request, {\n      indexTemplate,\n      cache: caches.default,\n      context: event,\n      // Buyer IP varies by hosting provider and runtime. You should provide this\n      // as an argument to the `handleRequest` function for your runtime.\n      // Defaults to `x-forwarded-for` header value.\n      buyerIpHeader: 'cf-connecting-ip',\n    });\n  } catch (error) {\n    return new Response(error.message || error.toString(), {status: 500});\n  }\n}\n\naddEventListener('fetch', (event) => event.respondWith(handleEvent(event)));\n")))),(0,o.yg)("ol",null,(0,o.yg)("li",{parentName:"ol"},(0,o.yg)("p",{parentName:"li"},"Update ",(0,o.yg)("inlineCode",{parentName:"p"},"package.json")," to specify the new Worker entry point. If the entry point is in ",(0,o.yg)("inlineCode",{parentName:"p"},"<root>/worker.js"),", then the changes look like the following:"),(0,o.yg)("pre",{parentName:"li"},(0,o.yg)("code",{parentName:"pre",className:"language-json"},'\n// Remove this line\n- "build": "shopify hydrogen build",\n\n// Add this line\n+ "build": "shopify hydrogen build --entry worker",\n'))),(0,o.yg)("li",{parentName:"ol"},(0,o.yg)("p",{parentName:"li"},"Deploy your project with ",(0,o.yg)("a",{parentName:"p",href:"https://developers.cloudflare.com/workers/cli-wrangler/install-update"},"Wrangler"),":"),(0,o.yg)("pre",{parentName:"li"},(0,o.yg)("code",{parentName:"pre",className:"language-bash"},"CF_ACCOUNT_ID=<YOUR_CLOUDFLARE_ACCT_ID> wrangler publish\n")))),(0,o.yg)("h2",{id:"avoid-rate-limiting-in-production"},"Avoid rate limiting in production"),(0,o.yg)("p",null,"If you're deploying to a non-Oxygen runtime, then this is a necessary step to avoid rate-limiting in production. ",(0,o.yg)("a",{parentName:"p",href:"/tutorials/environment-variables/#use-storefront-api-server-tokens"},"Learn more")," about why it's required."),(0,o.yg)("blockquote",null,(0,o.yg)("p",{parentName:"blockquote"},"Note:\nIn the following example, environment variables are stored in ",(0,o.yg)("inlineCode",{parentName:"p"},"Oxygen.env"),". If you're not deploying to Oxygen, then you can choose a different storage location.")),(0,o.yg)("ol",null,(0,o.yg)("li",{parentName:"ol"},(0,o.yg)("p",{parentName:"li"},"Create a ",(0,o.yg)("a",{parentName:"p",href:"http://shopify.dev/apps/auth/oauth/delegate-access-tokens"},"delegate access token")," for the Storefront API.")),(0,o.yg)("li",{parentName:"ol"},(0,o.yg)("p",{parentName:"li"},(0,o.yg)("a",{parentName:"p",href:"https://vitejs.dev/guide/env-and-mode.html#env-files"},"Store the token")," in a private environment variable called ",(0,o.yg)("inlineCode",{parentName:"p"},"PRIVATE_STOREFRONT_API_TOKEN"),".")),(0,o.yg)("li",{parentName:"ol"},(0,o.yg)("p",{parentName:"li"},"In the Hydrogen configuration file, set the private token using the variable ",(0,o.yg)("inlineCode",{parentName:"p"},"PRIVATE_STOREFRONT_API_TOKEN"),"."),(0,o.yg)("pre",{parentName:"li"},(0,o.yg)("code",{parentName:"pre",className:"language-tsx"},"// hydrogen.config.ts\n\nexport default defineConfig({\n  privateStorefrontToken:\n  /* In this example, the environment variable is stored in `Oxygen.env`.\n     If you're not deploying to Oxygen, then you can choose a different storage location.*/\n    Oxygen?.env?.PRIVATE_STOREFRONT_API_TOKEN,\n});\n")))))}u.isMDXComponent=!0}}]);