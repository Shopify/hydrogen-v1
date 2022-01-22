## Return value

This hook returns an object with the following keys:

| Key                    | Description                                                                                                                               |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `localizedString`      | A string returned by `new Intl.NumberFormat` for the amount and currency code, using the `defaultLocale` in the `shopify.config.js` file. |
| `currencyCode`         | The currency code from the `MoneyV2` object.                                                                                              |
| `currencyName`         | The name for the currency code, returned by `Intl.NumberFormat`.                                                                          |
| `currencySymbol`       | The currency symbol returned by `Intl.NumberFormat`.                                                                                      |
| `currencyNarrowSymbol` | The currency narrow symbol returned by `Intl.NumberFormat`.                                                                               |
| `amount`               | The localized amount, without any currency symbols or non-number types from the `Intl.NumberFormat.formatToParts` parts.                  |
| `parts`                | All parts returned by `Intl.NumberFormat.formatToParts`.                                                                                  |
| `original`             | The original `MoneyV2` object passed as an argument.                                                                                      |
