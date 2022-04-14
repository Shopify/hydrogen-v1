---
'@shopify/hydrogen': patch
---

Update `useUrl()` to allow a developer to subscribe to a reactive version of the current router location.

Example:

```jsx
import {useUrl} from '@shopify/hydrogen/client';

function MyClientComponent() {
  const url = useUrl();

  useEffect(() => {
    // Record navigation, analytics, etc
  }, [url]);
}
```
