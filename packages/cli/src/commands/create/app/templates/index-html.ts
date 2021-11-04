import {TemplateOptions} from 'types';
import {Feature} from '../../../../utilities/feature';

export default function ({ifFeature}: TemplateOptions) {
  return `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/src/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    ${ifFeature(
      Feature.Pwa,
      `
    <link rel="apple-touch-icon" href="/snowdevil-192w.png" />
    <meta name="theme-color" content="#2ec6b9" />
    `
    )}
    <title>Hydrogen App</title>
    <link rel="stylesheet" href="/src/index.css" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/entry-client.jsx"></script>
  </body>
</html>
`;
}
