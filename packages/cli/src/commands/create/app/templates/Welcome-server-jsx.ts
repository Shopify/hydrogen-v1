export default function () {
  return `
  import {Link} from '@shopify/hydrogen';

  export default function Welcome() {
    return (
      <>
        <h1>
          Welcome to{" "}
          <a target="_blank" href="https://github.com/Shopify/hydrogen">
            Hydrogen
          </a>{" "}
          💦
        </h1>
        <p>
          Hydrogen is a{" "}
          <a target="_blank" href="https://reactjs.org/">
            React
          </a>{" "}
          framework and a SDK for building custom{" "}
          <a target="_blank" href="https://shopify.com">
            Shopify
          </a>{" "}
          storefronts.
        </p>
        <p>
          Get started by editing <strong>pages/Index.server.jsx</strong>
          <br /> or reading our{" "}
          <a target="_blank" href="https://hydrogen.shopify.dev/">
            getting started guide
          </a>
          .
        </p>
      </>
    );
  }
  
`;
}
