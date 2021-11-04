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
import Link from '../components/Link.client';

export default function Index() {
  return (
    <div className="Page">
      <p>
        <Link className="link" to="/about">
          About
        </Link>
      </p>
      <h1>
        Welcome to{' '}
        <a target="_blank" href="https://github.com/Shopify/hydrogen">
          Hydrogen
        </a>{' '}
        💦
      </h1>
      <p>
        Hydrogen is a{' '}
        <a target="_blank" href="https://reactjs.org/">
          React
        </a>{' '}
        framework and a SDK for building custom{' '}
        <a target="_blank" href="https://shopify.com">
          Shopify
        </a>{' '}
        storefronts.
      </p>
      <p>
        Get started by editing <strong>pages/Index.server.jsx</strong>
        <br /> or reading our{' '}
        <a target="_blank" href="https://hydrogen.docs.shopify.io/">
          getting started guide
        </a>
        .
      </p>
      <h2 className="appName">${name}</h2>
      ${featuresMarkup}
    </div>
  );
}
`;
}
