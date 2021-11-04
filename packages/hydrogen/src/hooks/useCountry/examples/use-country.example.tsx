import {useCountry} from '@shopify/hydrogen';
import gql from 'graphql-tag';

export function MyComponent() {
  const [country, setCountry] = useCountry();

  const query = gql`
    query ProductPriceMax ($country: CountryCode) @inContext(country: $country){
      productByHandle(handle: "1234") {
        priceRange {
          maxVariantPrice{
            amount
            currencyCode
          }
        }
      }
    }
  `

  const {data} = useShopQuery({
    query,
    variables: {
      country: country.isoCode,
    }
  })

  return {/* Your JSX*/}
}
