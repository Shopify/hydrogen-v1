import {Feature} from '../../../../utilities/feature';
import {TemplateOptions} from '../../../../types';

export default function ({features, name}: TemplateOptions) {
  const featuresMarkup = features.length
    ? `
      <h2>Features:</h2>
      <ul>
        ${features
          .map(
            (feature) =>
              `<li ${
                features.includes(Feature.Tailwind)
                  ? `className="text-blue-700"`
                  : ''
              }>${feature}</li>`
          )
          .join('')}
      </ul>
    `
    : '';

  return `
import {Link} from '@shopify/hydrogen';
import Welcome from "../components/Welcome.server";

export default function Index() {
  return (
    <div className="Page">
      <p>
        <Link className="link" to="/about">
          About
        </Link>
      </p>
      <Welcome />
      ${featuresMarkup}
    </div>
  );
}
`;
}
