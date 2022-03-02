---
'template-hydrogen-default': minor
'@shopify/hydrogen': minor
---

`RawHtml` offically supports `DOMPurify` string sanitize with a new optional prop `dompurifyConfig`.
By default, `DOMpurify` will have config to forbid `style` tags: `{FORBID_TAGS: ['style']}`.
You can override this with `dompurifyConfig`.
See [DOMPurify](https://github.com/cure53/DOMPurify#can-i-configure-dompurify) for more configuration options.

Usage:

```
import {RawHtml} from '@shopify/hydrogen/client';

<RawHtml string={collection.descriptionHtml} className="text-lg" dompurifyConfig={{
  FORBID_TAGS: ['style', 'br']
}}/>
```

To upgrade, make sure to change the import path to `@shopify/hydrogen/client`

```diff
- import {RawHtml} from '@shopify/hydrogen';
+ import {RawHtml} from '@shopify/hydrogen/client';
```

**Note:** We converted `RawHtml` to a client only component because `DOMPurify` cannot sanitize
a string without a `DOM` object. `jsDOM` was the recommended library for running in node. However,
this library will bloat the vendor bundle by 4MB and it does not work in a worker enviroment. By
having `RawHtml` as a client componet, the string sanitization is happening in the client browser
where there will always be a `DOM` object available.
