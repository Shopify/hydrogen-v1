---
'@shopify/hydrogen': minor
---

Add `useLocation()` to allow a developer to subscribe to a reactive version of the current router location.

Example:

```jsx
import {useLocation} from '@shopify/hydrogen/client';

function MyClientComponent() {
  const location = useLocation();

  useEffect(() => {
    // Record navigation, analytics, etc
  }, [location]);
}
```
