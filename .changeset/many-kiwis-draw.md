---
'@shopify/hydrogen': patch
---

Experimental version of a new cart provider is ready for beta testing.
`CartProviderV2` fixes race conditions with our current cart provider. After beta, `CartProviderV2` will become `CartProvider` requiring no code changes.

To try this new cart provider:

```
import {CartProviderV2} from '@shopify/hydrogen/experimental';
```
