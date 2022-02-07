import {Link, Image} from '@shopify/hydrogen';

export default function Welcome() {
  return (
    <>
      <h1>
        Welcome to{' '}
        <a target="_blank" href="https://hydrogen.shopify.dev/">
          Hydrogen
        </a>{' '}
      </h1>
      <p>
        Hydrogen is an{' '}
        <a target="_blank" href="https://github.com/Shopify/hydrogen">
          open source
        </a>{' '}
        React framework and a SDK for building custom{' '}
        <a target="_blank" href="https://shopify.dev/">
          Shopify
        </a>{' '}
        storefronts.
      </p>
      <p>
        Get started by editing <strong>pages/Index.server.jsx</strong>,
        <br />
        reading our{' '}
        <a
          target="_blank"
          href="https://shopify.dev/custom-storefronts/hydrogen"
        >
          getting started guide
        </a>{' '}
        or opening the{' '}
        <a target="_blank" href="/graphiql">
          GraphiQL explorer
        </a>
        .
      </p>
    </>
  );
}
