"use strict";(self.webpackChunkdocs_v_1=self.webpackChunkdocs_v_1||[]).push([[754],{1036:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>l,contentTitle:()=>s,default:()=>d,frontMatter:()=>o,metadata:()=>i,toc:()=>u});var r=t(8168),a=(t(6540),t(5680));const o={},s="Performance best practices for Hydrogen",i={unversionedId:"tutorials/best-practices/performance",id:"tutorials/best-practices/performance",title:"Performance best practices for Hydrogen",description:"Hydrogen 2.0 is out now. These archival Hydrogen 1.0 docs are provided only to assist developers during their upgrade process. Please migrate as soon as possible.",source:"@site/docs/tutorials/best-practices/performance.md",sourceDirName:"tutorials/best-practices",slug:"/tutorials/best-practices/performance",permalink:"/hydrogen-v1/tutorials/best-practices/performance",draft:!1,tags:[],version:"current",frontMatter:{},sidebar:"hydrogen",previous:{title:"Hydrogen examples",permalink:"/hydrogen-v1/tutorials/best-practices/examples"},next:{title:"Testing best practices for Hydrogen",permalink:"/hydrogen-v1/tutorials/best-practices/testing"}},l={},u=[{value:"React Server Components",id:"react-server-components",level:2},{value:"Build shared components by default",id:"build-shared-components-by-default",level:3},{value:"Examples",id:"examples",level:4},{value:"Build server components as often as possible",id:"build-server-components-as-often-as-possible",level:3},{value:"Examples",id:"examples-1",level:4},{value:"Build client components in rare cases",id:"build-client-components-in-rare-cases",level:3},{value:"Examples",id:"examples-2",level:4},{value:"Data fetching",id:"data-fetching",level:2},{value:"First-party (Shopify) data source",id:"first-party-shopify-data-source",level:3},{value:"Third-party data source",id:"third-party-data-source",level:3},{value:"Caching and stale-while-revalidate",id:"caching-and-stale-while-revalidate",level:3},{value:"Avoid overfetching",id:"avoid-overfetching",level:3},{value:"Pages and subrequests",id:"pages-and-subrequests",level:2},{value:"Suspense boundaries",id:"suspense-boundaries",level:2},{value:"Placement of Suspense boundaries",id:"placement-of-suspense-boundaries",level:3},{value:"Prioritizing components",id:"prioritizing-components",level:3},{value:"Split queries",id:"split-queries",level:3},{value:"Combine and re-use queries",id:"combine-and-re-use-queries",level:3},{value:"Use a preload cache",id:"use-a-preload-cache",level:3},{value:"Server bundle size",id:"server-bundle-size",level:2},{value:"Next steps",id:"next-steps",level:2}],p={toc:u},c="wrapper";function d(e){let{components:n,...t}=e;return(0,a.yg)(c,(0,r.A)({},p,t,{components:n,mdxType:"MDXLayout"}),(0,a.yg)("h1",{id:"performance-best-practices-for-hydrogen"},"Performance best practices for Hydrogen"),(0,a.yg)("admonition",{type:"tip"},(0,a.yg)("p",{parentName:"admonition"},"Hydrogen 2.0 is out now. These archival Hydrogen 1.0 docs are provided only to assist developers during their upgrade process. Please ",(0,a.yg)("a",{parentName:"p",href:"/migrate"},"migrate")," as soon as possible.")),(0,a.yg)("p",null,"Hydrogen custom storefronts should be built with performance in mind, so that merchants and their customers can benefit from the fastest, most reliable online shopping experiences."),(0,a.yg)("p",null,"This guide describes best practices for making your Hydrogen custom storefront performant."),(0,a.yg)("h2",{id:"react-server-components"},"React Server Components"),(0,a.yg)("p",null,"Hydrogen is modelled after ",(0,a.yg)("a",{parentName:"p",href:"/tutorials/react-server-components/"},"React Server Components"),", an approach that offers an opinionated data-fetching and rendering workflow for React apps."),(0,a.yg)("p",null,"As you develop your Hydrogen custom storefront, you'll need to determine what to render on the server, what to the render on the client, and what to render on both the server and client. Making the right choices will result in performance benefits."),(0,a.yg)("h3",{id:"build-shared-components-by-default"},"Build shared components by default"),(0,a.yg)("p",null,"When you need to build a component from scratch, start with a shared component. The functionality of shared components can execute in both server and client contexts."),(0,a.yg)("p",null,"Starting in the middle helps you ask important questions:"),(0,a.yg)("ul",null,(0,a.yg)("li",{parentName:"ul"},(0,a.yg)("p",{parentName:"li"},"Can this code run only in the server or client?")),(0,a.yg)("li",{parentName:"ul"},(0,a.yg)("p",{parentName:"li"},"Should this code run only in the server or client?"))),(0,a.yg)("h4",{id:"examples"},"Examples"),(0,a.yg)("ul",null,(0,a.yg)("li",{parentName:"ul"},(0,a.yg)("a",{parentName:"li",href:"/templates/demo-store/src/components/elements/Icon.tsx"},"A shared component that represents an icon")),(0,a.yg)("li",{parentName:"ul"},(0,a.yg)("a",{parentName:"li",href:"/templates/demo-store/src/components/elements/Section.tsx"},"A shared component that displays a section on a page"))),(0,a.yg)("h3",{id:"build-server-components-as-often-as-possible"},"Build server components as often as possible"),(0,a.yg)("p",null,"The majority of the components in your app should be server components. Consider building a server component if any of the following use cases apply:"),(0,a.yg)("ul",null,(0,a.yg)("li",{parentName:"ul"},(0,a.yg)("p",{parentName:"li"},"The component includes code that shouldn\u2019t be exposed on the client, like proprietary business logic and secrets.")),(0,a.yg)("li",{parentName:"ul"},(0,a.yg)("p",{parentName:"li"},"The component won\u2019t be used by a client component.")),(0,a.yg)("li",{parentName:"ul"},(0,a.yg)("p",{parentName:"li"},"The code never executes on the client.")),(0,a.yg)("li",{parentName:"ul"},(0,a.yg)("p",{parentName:"li"},"The code needs to access the filesystem or databases, which aren\u2019t available on the client.")),(0,a.yg)("li",{parentName:"ul"},(0,a.yg)("p",{parentName:"li"},"The code fetches data from the Storefront API.")),(0,a.yg)("li",{parentName:"ul"},(0,a.yg)("p",{parentName:"li"},"The code renders static or infrequently updated content, such as an About page."))),(0,a.yg)("h4",{id:"examples-1"},"Examples"),(0,a.yg)("ul",null,(0,a.yg)("li",{parentName:"ul"},(0,a.yg)("a",{parentName:"li",href:"/templates/demo-store/src/components/account/AccountDetails.client.tsx"},"A server component that renders account details")),(0,a.yg)("li",{parentName:"ul"},(0,a.yg)("a",{parentName:"li",href:"/templates/demo-store/src/components/global/NotFound.server.tsx"},"A server component that renders a 404 page"))),(0,a.yg)("h3",{id:"build-client-components-in-rare-cases"},"Build client components in rare cases"),(0,a.yg)("p",null,"Generally, you don't need to convert the entire component into a client component - only the logic necessary for the client needs to be extracted out into a client component. Consider building a client component if any of the following uses cases apply:"),(0,a.yg)("ul",null,(0,a.yg)("li",{parentName:"ul"},(0,a.yg)("p",{parentName:"li"},"You require client-side interactivity.")),(0,a.yg)("li",{parentName:"ul"},(0,a.yg)("p",{parentName:"li"},"You're using the ",(0,a.yg)("a",{parentName:"p",href:"https://reactjs.org/docs/hooks-reference.html#usestate"},(0,a.yg)("inlineCode",{parentName:"a"},"useState"))," or ",(0,a.yg)("a",{parentName:"p",href:"https://reactjs.org/docs/hooks-reference.html#usereducer"},(0,a.yg)("inlineCode",{parentName:"a"},"useReducer"))," React hooks.")),(0,a.yg)("li",{parentName:"ul"},(0,a.yg)("p",{parentName:"li"},"You're using lifecycle rendering logic (for example, implementing the React ",(0,a.yg)("a",{parentName:"p",href:"https://reactjs.org/docs/hooks-reference.html#useeffect"},(0,a.yg)("inlineCode",{parentName:"a"},"useEffect"))," hook).")),(0,a.yg)("li",{parentName:"ul"},(0,a.yg)("p",{parentName:"li"},"You're making use of a third-party library that doesn\u2019t support React Server Components.")),(0,a.yg)("li",{parentName:"ul"},(0,a.yg)("p",{parentName:"li"},"You're using browser APIs that aren\u2019t supported on the servers."))),(0,a.yg)("h4",{id:"examples-2"},"Examples"),(0,a.yg)("ul",null,(0,a.yg)("li",{parentName:"ul"},(0,a.yg)("a",{parentName:"li",href:"templates/demo-store/src/components/product/ProductInfo.client.tsx"},"A client component that renders product information")),(0,a.yg)("li",{parentName:"ul"},(0,a.yg)("a",{parentName:"li",href:"/templates/demo-store/src/components/account/AccountLoginForm.client.tsx"},"A client component that renders an account login form"))),(0,a.yg)("h2",{id:"data-fetching"},"Data fetching"),(0,a.yg)("p",null,"Delivering fast server-side responses requires fast and efficient ",(0,a.yg)("a",{parentName:"p",href:"/hydrogen-v1/tutorials/data-sources/#shopify-data-source"},"first-party (Shopify)")," and ",(0,a.yg)("a",{parentName:"p",href:"/tutorials/data-sources/work-with-3p-data-sources"},"third-party data access"),"."),(0,a.yg)("h3",{id:"first-party-shopify-data-source"},"First-party (Shopify) data source"),(0,a.yg)("p",null,"Consider ",(0,a.yg)("a",{parentName:"p",href:"/hydrogen-v1/tutorials/deployment#deploy-to-oxygen"},"deploying your Hydrogen custom storefront on Oxygen"),", Shopify's recommended deployment platform for Hydrogen storefronts. Oxygen provides caching out of the box for routes and sub-requests."),(0,a.yg)("h3",{id:"third-party-data-source"},"Third-party data source"),(0,a.yg)("p",null,"If you're fetching from a third-party data source, then the runtime exposes the standard ",(0,a.yg)("a",{parentName:"p",href:"https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API"},"Fetch API")," enhanced with smart cache defaults and ",(0,a.yg)("a",{parentName:"p",href:"/tutorials/querying/cache/"},"configurable caching strategies"),"."),(0,a.yg)("p",null,"The following example shows how to fetch from a third-party data source and make sure that customers get the quickest response possible while also displaying the latest data:"),(0,a.yg)("pre",null,(0,a.yg)("code",{parentName:"pre",className:"language-js"},"// 3p-hydrogen-fetch.js\n\nimport {fetchSync, CacheLong} from '@shopify/hydrogen';\nfunction MyServerComponent() {\n  const {data} = fetchSync('https://my.3p.com/data.json', {\n    cache: CacheLong(),\n  }).json();\n}\n")),(0,a.yg)("h3",{id:"caching-and-stale-while-revalidate"},"Caching and stale-while-revalidate"),(0,a.yg)("p",null,(0,a.yg)("a",{parentName:"p",href:"/tutorials/querying/cache/"},"Caching")," is a fundamental building block of a good shopping experience. By configuring ",(0,a.yg)("inlineCode",{parentName:"p"},"maxAge")," and ",(0,a.yg)("inlineCode",{parentName:"p"},"staleWhileRevalidate"),", you have full control over data freshness and the revalidation strategy."),(0,a.yg)("p",null,"For example, if a response is considered stale due to being older than ",(0,a.yg)("inlineCode",{parentName:"p"},"maxAge"),", but it's still within the additional time window provided by ",(0,a.yg)("inlineCode",{parentName:"p"},"staleWhileRevalidate"),", then the response is used. The data is also asynchronously revalidated in preparation for the next request. This keeps your content fresh and your store performant."),(0,a.yg)("p",null,"If a stale response falls outside the ",(0,a.yg)("inlineCode",{parentName:"p"},"staleWhileRevalidate")," window, then the response is revalidated before being delivered."),(0,a.yg)("p",null,"Hydrogen's ",(0,a.yg)("a",{parentName:"p",href:"/hydrogen-v1/tutorials/querying/cache#caching-strategies"},"caching strategies")," include ",(0,a.yg)("inlineCode",{parentName:"p"},"maxAge")," and ",(0,a.yg)("inlineCode",{parentName:"p"},"staleWhileRevalidate")," values by default:"),(0,a.yg)("pre",null,(0,a.yg)("code",{parentName:"pre",className:"language-js"},'// data-fetching-caching-strategies.js\n\n// First-party request\nimport { useShopQuery, CacheLong } from "@shopify/hydrogen";\nexport default function Example() {\n  const {\n    data: { shop },\n  } = useShopQuery({\n    query: `query shopName { shop { name } }`,\n    cache: CacheLong(), // max-age=900, stale-while-revalidate=900\n  });\n  return <p>Cached a response from the Storefront API.</p>;\n}\n\n// Third-party simple fetch\nimport { fetchSync, CacheLong } from "@shopify/hydrogen";\nexport default function Example() {\n  const data = fetchSync("https://my.3p.com/data.json", {\n    cache: CacheLong(), // max-age=900, stale-while-revalidate=900\n  }).json();\n  return <p>Cached a response from a third-party simple fetch.</p>;\n}\n\n// Third-party SDK\nimport { useQuery, CacheLong } from "@shopify/hydrogen";\nexport default function Example() {\n  const { data } = useQuery(\n    ["unique", "key"],\n    async () => {\n      return await exampleSDK.get(\'some-resource\')\n    },\n    {\n      cache: CacheLong(), // maxAge=900, stale-while-revalidate=900\n    }\n  );\n  return <p>Cached a response from a third-party SDK.</p>;\n}\n\n')),(0,a.yg)("p",null,"If you don't want to use the caching strategies provided by Hydrogen, then you can create your own using a ",(0,a.yg)("inlineCode",{parentName:"p"},"CustomCache")," strategy:"),(0,a.yg)("pre",null,(0,a.yg)("code",{parentName:"pre",className:"language-js"},'// data-fetching-custom-caching-strategy.js\n\nimport { useShopQuery, CacheCustom } from "@shopify/hydrogen";\nexport default function Example() {\n  const {\n    data: { shop },\n  } = useShopQuery({\n    query: `query shopName { shop { name } }`,\n    cache: CacheCustom({\n      maxAge: 30,\n      staleWhileRevalidate: 30,\n    })\n  });\n  return <p>Cached a response from the Storefront API using custom cache values.</p>;\n}\n')),(0,a.yg)("blockquote",null,(0,a.yg)("p",{parentName:"blockquote"},"Note:\nSub-request caching is disabled by default during development. To learn how to enable sub-request caching, refer to ",(0,a.yg)("a",{parentName:"p",href:"/hydrogen-v1/tutorials/querying/cache#sub-request-caching"},"Sub-request caching"),".")),(0,a.yg)("h3",{id:"avoid-overfetching"},"Avoid overfetching"),(0,a.yg)("p",null,"Requesting too much data from the Storefront API or from other resources can slow down your Hydrogen storefront. You should make sure that your Hydrogen app is only requesting that data it needs to render a route."),(0,a.yg)("p",null,"To help you request only the data that you need, Hydrogen includes a ",(0,a.yg)("a",{parentName:"p",href:"/utilities/log/"},(0,a.yg)("inlineCode",{parentName:"a"},"log"))," utility that identifies unused data returned from ",(0,a.yg)("a",{parentName:"p",href:"/hooks/global/useshopquery/"},(0,a.yg)("inlineCode",{parentName:"a"},"useShopQuery")),". The ",(0,a.yg)("inlineCode",{parentName:"p"},"log")," utility prints unused query properties in the server console to highlight potential data over-fetching."),(0,a.yg)("p",null,"To enable logging for unused query properties, set the ",(0,a.yg)("inlineCode",{parentName:"p"},"logger.showUnusedQueryProperties")," option to ",(0,a.yg)("inlineCode",{parentName:"p"},"true")," in your ",(0,a.yg)("a",{parentName:"p",href:"/hydrogen-v1/tutorials/configuration/#logger"},"Hydrogen configuration file"),"."),(0,a.yg)("p",null,"Then, visit your terminal that's running the development server to see any notices printed by the utility:"),(0,a.yg)("pre",null,(0,a.yg)("code",{parentName:"pre",className:"language-bash"},'GET Server Components 200 878.05 ms  {"pathname":"/products/snowboard","search":""}\n\nWARN:  Potentially overfetching fields in GraphQL query.\nQuery `product` in file `/src/routes/products/[handle].server.jsx:30:29` (function `Product`):\n\u2022 product.media.sources.mimeType\n\u2022 product.media.sources.url\n\u2022 product.media.embedUrl\n\u2022 product.media.host\n\u2022 product.media.sources.url\n\u2022 product.metafields.reference.id\n  ...and 25 more\nExamine the list of fields above to confirm that they are being used\n')),(0,a.yg)("h2",{id:"pages-and-subrequests"},"Pages and subrequests"),(0,a.yg)("p",null,"Hydrogen doesn't require that all requests are server-rendered. ",(0,a.yg)("a",{parentName:"p",href:"/tutorials/routing/"},"Routes and subrequests")," with static or infrequently updated content can be served from the edge."),(0,a.yg)("p",null,"For example, a marketing page that\u2019s typically static can be ",(0,a.yg)("a",{parentName:"p",href:"/tutorials/querying/cache/"},"cached"),", served directly from the CDN edge, and asynchronously revalidated with the help of the ",(0,a.yg)("inlineCode",{parentName:"p"},"CacheLong()")," caching strategy:"),(0,a.yg)("pre",null,(0,a.yg)("code",{parentName:"pre",className:"language-js"},"// routes/products/[handle].server.jsx\n\nimport {CacheLong} from '@shopify/hydrogen';\nexport default function MarketingPage({response}) {\n  response.cache(CacheLong());\n // ...\n}\n")),(0,a.yg)("h2",{id:"suspense-boundaries"},"Suspense boundaries"),(0,a.yg)("p",null,"Data fetching in Hydrogen is powered by ",(0,a.yg)("a",{parentName:"p",href:"https://reactjs.org/docs/react-api.html#reactsuspense"},"React Suspense"),". When you define a Suspense boundary, you provide a fallback component to render until the contents of the Suspense boundary is resolved."),(0,a.yg)("p",null,"It's important to wrap your server components that fetch data in Suspense boundaries. This allows Hydrogen to stream the fallback components to your users immediately rather than waiting for all of the data to be resolved."),(0,a.yg)("h3",{id:"placement-of-suspense-boundaries"},"Placement of Suspense boundaries"),(0,a.yg)("p",null,"Wrap a Suspense boundary around the content that suspends, not inside of it:"),(0,a.yg)("pre",null,(0,a.yg)("code",{parentName:"pre",className:"language-js"},'// routes/products/[handle].server.jsx\n\n// \ud83d\udd34 Don\'t do this:\nexport default function Product() {\n  const {data} = useShopQuery({ ... });\n\n  return (\n    <Suspense fallback="Loading...">\n      <h1>{data.product.title}</h1>\n    </Suspense>\n  );\n}\n\n// \u2705 Do this:\nexport default function Product() {\n  return (\n    <Suspense fallback="Loading...">\n      <ProductDetails />\n    </Suspense>\n  );\n}\n\nfunction ProductDetails() {\n  const {data} = useShopQuery({ ... });\n\n  return <h1>{data.product.title}</h1>\n}\n')),(0,a.yg)("h3",{id:"prioritizing-components"},"Prioritizing components"),(0,a.yg)("p",null,"It's important to prioritize some content over other content. For example, you might want some product details like title, image, and description to load before other product details, like reviews or related products."),(0,a.yg)("p",null,"You can prioritize some components and defer other components by wrapping Suspense boundaries around the deferred components in the same app tree. This allows Hydrogen to stream the prioritized component's data first, and fetch the data for the deferred components asynchronously:"),(0,a.yg)("pre",null,(0,a.yg)("code",{parentName:"pre",className:"language-js"},'// routes/products/[handle].server.jsx\n\nexport default function Product() {\n  return (\n    // First, this component suspends and resolves.\n    <ProductDetails />\n\n    // Then, these two components return fallbacks and resolve later.\n    <Suspense fallback="Loading reviews...">\n      <ProductReviews />\n    </Suspense>\n    <Suspense fallback="Loading related products...">\n      <RelatedProducts />\n    </Suspense>\n  );\n}\n\nfunction ProductDetails() {\n  const {data} = useShopQuery({ ... });\n\n  //\n}\n\nfunction ProductReviews() {\n  const {data} = useShopQuery({ ... });\n\n  //\n}\n\nfunction RelatedProducts() {\n  const {data} = useShopQuery({ ... });\n\n  //\n}\n')),(0,a.yg)("h3",{id:"split-queries"},"Split queries"),(0,a.yg)("p",null,"Some data sources might load more quickly than others. If your Hydrogen storefront is responding slowly, then you might want to evaluate how you're writing your queries and consider splitting them up."),(0,a.yg)("p",null,"For example, requesting a shop's name and information from the Storefront API is very quick, while loading many collections with nested product details will be less quick. Because both pieces of data are requested in the same query, the response will only be as quick as the slowest resource:"),(0,a.yg)("pre",null,(0,a.yg)("code",{parentName:"pre",className:"language-js"},'// routes/products/[handle].server.jsx\n\nexport default function Product() {\n  return (\n    <Suspense fallback="Loading...">\n      <ProductPage />\n    </Suspense>\n  );\n}\n\nconst QUERY = `\n  query EverythingData {\n    shop {\n      name\n    }\n\n    collection(handle: "shoes") {\n      products(first: 250) {\n        nodes {\n          title\n        }\n      }\n    }\n  }\n`;\n\nfunction ProductPage() {\n  const {data} = useShopQuery({query: QUERY});\n\n  return (\n    <>\n      <h1>{data.shop.name}</h1>\n      <p>Products in this collection: {data.collection.products.nodes.length}</p>\n    </>\n  );\n}\n')),(0,a.yg)("p",null,"Instead, you can split the query for basic storefront data from the query for collection information to make the storefront data load quicker:"),(0,a.yg)("pre",null,(0,a.yg)("code",{parentName:"pre",className:"language-js"},'// routes/products/[handle].server.jsx\n\nexport default function Product() {\n  return (\n    <>\n      <Suspense fallback="Loading Storefront Info...">\n        <StorefrontInfo />\n      </Suspense>\n      <Suspense fallback="Loading Product Info...">\n        <ProductPage />\n      </Suspense>\n    </>\n  );\n}\n\nconst STOREFRONT_QUERY = `\n  query StorefrontData {\n    shop {\n      name\n    }\n  }\n`;\n\nfunction StorefrontInfo() {\n  const {data} = useShopQuery({query: STOREFRONT_QUERY});\n\n  return <h1>{data.shop.name}</h1>;\n}\n\nconst COLLECTION_QUERY = `\n  query CollectionData {\n    collection(handle: "shoes") {\n      products(first: 250) {\n        nodes {\n          title\n        }\n      }\n    }\n  }\n`;\n\nfunction ProductPage() {\n  const {data} = useShopQuery({query: COLLECTION_QUERY});\n\n  return <p>Products in this collection: {data.collection.products.nodes.length}</p>;\n}\n')),(0,a.yg)("h3",{id:"combine-and-re-use-queries"},"Combine and re-use queries"),(0,a.yg)("p",null,"Sometimes it makes sense to split queries, and other times it makes more sense to combine and re-use queries. You can experiment with combining or splitting your queries to see what approach works better for your use case."),(0,a.yg)("p",null,"Hydrogen de-duplicates identical requests made to ",(0,a.yg)("a",{parentName:"p",href:"/hooks/global/fetchsync/"},(0,a.yg)("inlineCode",{parentName:"a"},"fetchSync")),", ",(0,a.yg)("a",{parentName:"p",href:"/hooks/global/useshopquery/"},(0,a.yg)("inlineCode",{parentName:"a"},"useShopQuery"))," and ",(0,a.yg)("a",{parentName:"p",href:"/hooks/global/usequery/"},(0,a.yg)("inlineCode",{parentName:"a"},"useQuery")),". This means that if you fetch a data resource in one component, then fetching an identical data resource in another component won't result in an additional API request."),(0,a.yg)("p",null,"You can use this behavior to your advantage. For example, the following components request very similar data, but they're not identical:"),(0,a.yg)("pre",null,(0,a.yg)("code",{parentName:"pre",className:"language-js"},'// components/ProductTitle.server.jsx\n\nconst QUERY = `\n  query ProductTitle {\n    product(handle: "shoes") {\n      title\n    }\n  }\n`;\n\nexport default function ProductTitle() {\n  const {data} = useShopQuery({query: QUERY});\n\n  return <h1>{data.product.title}</h1>;\n}\n')),(0,a.yg)("pre",null,(0,a.yg)("code",{parentName:"pre",className:"language-js"},'// components/ProductVendor.server.jsx\n\nconst QUERY = `\n  query ProductVendor {\n    product(handle: "shoes") {\n      vendor\n    }\n  }\n`;\n\nexport default function ProductVendor() {\n  const {data} = useShopQuery({query: QUERY});\n\n  return <div className="vendor">{data.product.vendor}</div>;\n}\n')),(0,a.yg)("p",null,"If you combine the above two queries, then Hydrogen only makes a single call to the Storefront API, and your components can read from the same response:"),(0,a.yg)("pre",null,(0,a.yg)("code",{parentName:"pre",className:"language-js"},'// components/ProductTitle.server.jsx\n\nexport const PRODUCT_QUERY = `\n  query ProductInfo {\n    product(handle: "shoes") {\n      title\n      vendor\n    }\n  }\n`;\n\nexport default function ProductTitle() {\n  const {data} = useShopQuery({query: PRODUCT_QUERY});\n\n  return <h1>{data.product.title}</h1>;\n}\n')),(0,a.yg)("pre",null,(0,a.yg)("code",{parentName:"pre",className:"language-js"},"// components/ProductVendor.server.jsx\n\nimport {PRODUCT_QUERY} from './ProductTitle.server';\n\nexport default function ProductVendor() {\n  const {data} = useShopQuery({query: PRODUCT_QUERY});\n\n  return <div className=\"vendor\">{data.product.vendor}</div>;\n}\n")),(0,a.yg)("h3",{id:"use-a-preload-cache"},"Use a preload cache"),(0,a.yg)("p",null,"Hydrogen offers a ",(0,a.yg)("a",{parentName:"p",href:"/tutorials/querying/preloaded-queries/"},"preload cache")," that you should enable for non-personalized data resources. This allows Hydrogen to start loading all of the required resources for a given page immediately, rather than after the entire app tree has been resolved and rendered."),(0,a.yg)("pre",null,(0,a.yg)("code",{parentName:"pre",className:"language-tsx"},"// components/Marketing.server.jsx\n\nconst data = fetchSync('https://my.api.com/static-data.json', {\n  preload: true,\n}).json();\n")),(0,a.yg)("h2",{id:"server-bundle-size"},"Server bundle size"),(0,a.yg)("p",null,"When you deploy your Hydrogen storefront on a Workers runtime like Oxygen or Cloudflare Workers, it's important to maintain a small server bundle size. This is because each serverless invocation becomes slower as the size of the code grows larger."),(0,a.yg)("p",null,"Some client-only dependencies like ",(0,a.yg)("a",{parentName:"p",href:"https://threejs.org/"},(0,a.yg)("inlineCode",{parentName:"a"},"threejs"))," might be larger than 500KB when bundled on the server. You can reduce the server bundle size by preventing these dependencies from being included in the bundle."),(0,a.yg)("p",null,"Hydrogen provides a ",(0,a.yg)("inlineCode",{parentName:"p"},"import.meta.env.SSR")," object to allow you to tree-shake these dependencies from your server bundle:"),(0,a.yg)("pre",null,(0,a.yg)("code",{parentName:"pre",className:"language-js"},"// components/Product.client.jsx\n\nimport {lazy} from 'react';\n\n/**\n * Provide a consistent fallback to prevent hydration mismatch errors.\n */\nconst BoxFallback = () => '...';\n\n/**\n * If server-side rendering, then return the fallback instead of the heavy dependency.\n */\nconst Box = import.meta.env.SSR\n  ? BoxFallback\n  : lazy(() => import('./Box.client'));\n\nexport default function Product() {\n  return (\n    <Suspense fallback={<BoxFallback />}>\n      <Box />\n    </Suspense>\n  );\n}\n")),(0,a.yg)("blockquote",null,(0,a.yg)("p",{parentName:"blockquote"},"Note:\nThis method only works when importing client components from existing client components. You can't use this method inside server components.")),(0,a.yg)("h2",{id:"next-steps"},"Next steps"),(0,a.yg)("ul",null,(0,a.yg)("li",{parentName:"ul"},"Learn about ",(0,a.yg)("a",{parentName:"li",href:"/tutorials/best-practices/accessibility/"},"best practices for making your Hydrogen custom storefront accessible"),".")))}d.isMDXComponent=!0},5680:(e,n,t)=>{t.d(n,{xA:()=>p,yg:()=>y});var r=t(6540);function a(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function o(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);n&&(r=r.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,r)}return t}function s(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?o(Object(t),!0).forEach((function(n){a(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):o(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function i(e,n){if(null==e)return{};var t,r,a=function(e,n){if(null==e)return{};var t,r,a={},o=Object.keys(e);for(r=0;r<o.length;r++)t=o[r],n.indexOf(t)>=0||(a[t]=e[t]);return a}(e,n);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)t=o[r],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(a[t]=e[t])}return a}var l=r.createContext({}),u=function(e){var n=r.useContext(l),t=n;return e&&(t="function"==typeof e?e(n):s(s({},n),e)),t},p=function(e){var n=u(e.components);return r.createElement(l.Provider,{value:n},e.children)},c="mdxType",d={inlineCode:"code",wrapper:function(e){var n=e.children;return r.createElement(r.Fragment,{},n)}},h=r.forwardRef((function(e,n){var t=e.components,a=e.mdxType,o=e.originalType,l=e.parentName,p=i(e,["components","mdxType","originalType","parentName"]),c=u(t),h=a,y=c["".concat(l,".").concat(h)]||c[h]||d[h]||o;return t?r.createElement(y,s(s({ref:n},p),{},{components:t})):r.createElement(y,s({ref:n},p))}));function y(e,n){var t=arguments,a=n&&n.mdxType;if("string"==typeof e||a){var o=t.length,s=new Array(o);s[0]=h;var i={};for(var l in n)hasOwnProperty.call(n,l)&&(i[l]=n[l]);i.originalType=e,i[c]="string"==typeof e?e:a,s[1]=i;for(var u=2;u<o;u++)s[u]=t[u];return r.createElement.apply(null,s)}return r.createElement.apply(null,t)}h.displayName="MDXCreateElement"}}]);