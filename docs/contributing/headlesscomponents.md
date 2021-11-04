# What are headless components?

At their core, headless components reflect the separation of concerns between UI and business logic. Headless components should contain all the business logic for the commerce concept they encompass, and leave all customization related to styling (CSS) and voice/tone (content) to the consumer. They should provide sensible defaults, and also make it easy to diverge from these defaults via customization.

## Styleless but styleable

A headless component should never provide visual styles. A headless component should focus on handling data (parsing, processing, etc) and providing limited, sensible markup. Any behaviour related to styling should be only for passing the styling through to its own HTML elements or their children.

When rendered by default, without any class names or styles, a headless component should only take on the styles provided natively by the browser. All styling should be provided by consumers of the headless component, either via the `className` prop or style attribute on the headless component.

Another way to think about this is: A storefront consisting of only headless components should be functional and render nicely when a stylesheet is not provided.

## Sensible defaults

Headless components should always render sensible defaults for semantic markup and localization.

Different HTML elements exist for a reason and, in the absence of styling, headless components should lean on semantic HTML elements for providing meaning and hierarchy. For example, if a headless component must render an image, it should output an `img` tag; a date, a `time` tag; a group of related sentences, a `p` tag.

The default display for many concepts relies on the country and language context in which it is used, and headless components should always ensure they are outputting defaults in a localized manner. This involves making use of built-in Javascript objects such an `Intl` for displaying currency and measurements, and `Date` for displaying dates and times.

## Easily customizable

Headless components should be just as easily customizable as if the developer was coding it with raw HTML and Javascript themselves. Developers should be able to add event listeners, aria attributes, and custom data attributes, unless these attributes need to be specifically controlled by the headless component (for example, the `AddToCartButton` must control the `onClick` attribute in order to add an item to the cart).

Even though headless components provide sensible defaults, there are many use cases where developers need to diverge from the default provided. In this case, customization can be supported via render props.

Keep in mind when it comes to customization: “Common things should be easy; uncommon things should be possible” (credit on this quote goes to Ash Furrow). The most common thing should be accomplished by sensible defaults (described in the previous section), uncommon things should be accomplished by customization via render props. Only in rare/edge cases should developers of Hydrogen need to abandon the use of a component entirely and build their own implementation of it.

## Never include hardcoded content (strings)

Headless components should never include hardcoded content (for example, strings like “Add to cart” and “Remove from cart”). Content is similar to visual styles in that it can be highly customizable in tone, audience, language, etc. Instead of providing content themselves, content should always be provided to the headless component by the consumer via either children or props.
