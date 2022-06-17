"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.graphiqlHtml = void 0;
function graphiqlHtml(shop, token, apiVersion) {
    return `<html>
  <head>
    <title>Shopify Storefront API</title>
    <link href="https://unpkg.com/graphiql/graphiql.min.css" rel="stylesheet" />
  </head>
  <body style="margin: 0;">
    <div id="graphiql" style="height: 100vh;"></div>
    <script
      crossorigin
      src="https://unpkg.com/react/umd/react.production.min.js"
    ></script>
    <script
      crossorigin
      src="https://unpkg.com/react-dom/umd/react-dom.production.min.js"
    ></script>
    <script
      crossorigin
      src="https://unpkg.com/graphiql/graphiql.min.js"
    ></script>
    <script>
      const fetcher = GraphiQL.createFetcher({
        url: 'https://${shop}/api/${apiVersion}/graphql.json',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/graphql',
          'X-Shopify-Storefront-Access-Token': '${token}'
        }
      });
      ReactDOM.render(
        React.createElement(GraphiQL, { fetcher: fetcher }),
        document.getElementById('graphiql'),
      );
    </script>
  </body>
</html>
`;
}
exports.graphiqlHtml = graphiqlHtml;
