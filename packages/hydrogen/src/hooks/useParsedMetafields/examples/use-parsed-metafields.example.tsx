import {useParsedMetafields, Metafield} from '@shopify/hydrogen';

export function Product(product) {
  const metafields = useParsedMetafields(product.metafields);

  return (
    <ul>
      {metafields.map((field) => {
        return <li><Metafield metafield={field} /></li>
      })}
    </ul>
  )
}
