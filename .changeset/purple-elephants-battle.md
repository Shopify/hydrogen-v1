---
'@shopify/hydrogen': minor
---

**Breaking change:** We are starting to use [`exports` property in `package.json`](https://nodejs.org/api/packages.html#package-entry-points) to list all the entry points in this package.

This might incur breaking changes in some rare cases when importing private properties from Hydrogen `dist` files. Notice that we **discourage** doing so for anything that is not publicly documented but, if your app was relying on some private properties, then this might help:

```diff
-import {xyz} from '@shopify/hydrogen/dist/esnext/<internal-path>';
+import {xyz} from '@shopify/hydrogen/<internal-path>';
```

Aside from that, it is recommended that TypeScript projects update the `tsconfig.json` file to use `compilerOptions.moduleResolution: "node16"` to make sure Hydrogen types are loaded in your editor.
For JavaScript projects, create or edit `<root>/jsconfig.json` file with the following information to improve typings:

```json
{
  "compilerOptions": {
    "target": "es2020",
    "module": "esnext",
    "moduleResolution": "node16",
    "lib": ["dom", "dom.iterable", "scripthost", "es2020"],
    "jsx": "react",
    "types": ["vite/client"]
  },
  "exclude": ["node_modules", "dist"],
  "include": ["**/*.js", "**/*.jsx"]
}
```
