# Create custom fonts


:::tip
Hydrogen 2.0 is out now. These archival Hydrogen 1.0 docs are provided only to assist developers during their upgrade process. Please [migrate](/migrate) as soon as possible.
:::



If you want to use a font that's not included in Shopify's font library, then you can use fonts from third-party solutions such as [Typekit](https://fonts.adobe.com/fonts) or create custom fonts.

## Create a custom font

1. Add font files inside the `/public` folder. For example, add font files to `/public/fonts`.
2. Create a `.css` file that loads the local custom font and reference the font with `url()`:

    ```css
    /* custom-font.css */

    /* fraunces-regular - latin */
    @font-face {
      font-family: 'Fraunces';
      font-style: normal;
      font-display: swap;
      font-weight: 400;
      src: url('/fonts/fraunces-v22-latin-regular.eot'); /* IE9 Compat Modes */
      src: local(''),
        url('/fonts/fraunces-v22-latin-regular.eot?#iefix')
          format('embedded-opentype'),
        /* IE6-IE8 */ url('/fonts/fraunces-v22-latin-regular.woff2') format('woff2'),
        /* Super Modern Browsers */ url('/fonts/fraunces-v22-latin-regular.woff')
          format('woff'),
        /* Modern Browsers */ url('/fonts/fraunces-v22-latin-regular.ttf')
          format('truetype'),
        /* Safari, Android, iOS */
          url('/fonts/fraunces-v22-latin-regular.svg#Fraunces') format('svg'); /* Legacy iOS */
    }
    ```



3. Import your `.css` file into `index.html` or any desired client component.
