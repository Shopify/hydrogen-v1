import {Metafield} from '@shopify/hydrogen';

export function Product({product}) {
  const metafield = product.metafields.edges.map(({node}) => node)[0];

  return <Metafield metafield={metafield} />;
}

export function ProductWithRenderProp({product}) {
  const metafield = product.metafields.edges.map(({node}) => node)[0];

  return (
    <Metafield metafield={metafield}>
      {(metafield) => {
        return (
          <p>
            {metafield.namespace} {metafield.key}: {metafield.value}
          </p>
        );
      }}
    </Metafield>
  );
}
