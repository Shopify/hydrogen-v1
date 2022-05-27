---
'@shopify/hydrogen': patch
---

## `<Image/>` updates

- Fixed some TypeScript type issues with Image.
- `data.url` and `alt` are now required props in Typescript, but won't break the actual component if you don't pass them.
