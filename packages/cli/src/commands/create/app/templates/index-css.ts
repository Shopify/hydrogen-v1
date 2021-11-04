import {TemplateOptions} from 'types';
import {Feature} from '../../../../utilities/feature';

export default function ({ifFeature}: TemplateOptions) {
  return `
${ifFeature(Feature.Tailwind, '@tailwind utilities;')}
* {
  font-size: 24px;
  line-height: 1.3;
  padding: 0;
  margin: 0;
  color: black;
}

p,
ul,
h1 {
  padding-bottom: 24px;
}

.Page {
  font-family: sans-serif;
  max-width: 24em;
  padding: 48px;
}

li {
  list-style-position: inside;
}
  `;
}
