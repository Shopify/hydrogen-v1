import {TemplateOptions} from 'types';

export default function ({ifFeature}: TemplateOptions) {
  return `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Hydrogen App</title>
    <link rel="stylesheet" href="/src/index.css" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="@shopify/hydrogen/entry-client"></script>
  </body>
</html>
`;
}
