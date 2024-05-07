# Accessibility best practices for Hydrogen


:::tip
Hydrogen 2.0 is out now. These archival Hydrogen 1.0 docs are provided only to assist developers during their upgrade process. Please [migrate](/migrate) as soon as possible.
:::



When you build your Hydrogen custom storefront, make design choices that help keep content accessible. An accessible storefront is designed so that it can be used by everyone, including people who rely on [assistive technology](https://www.w3.org/WAI/perspective-videos/). Accessibility for your storefront is essential to providing an inclusive experience for merchants and customers.

The accessibility best practices for Hydrogen custom storefronts were created with the [Web Content Accessibility Guidelines (WCAG)](https://www.w3.org/TR/WCAG21/) in mind.

> Note:
> There are many factors to consider when creating an accessible storefront. Following only the best practices on this page doesn't guarantee that your storefront is completely accessible.

## Accessibility testing

You can test the accessibility of your Hydrogen custom storefront by using tools such as:

* [Accessibility Insights for Web](https://accessibilityinsights.io/en/)
* [Lighthouse](https://developers.google.com/web/tools/lighthouse)
* [WAVE](https://wave.webaim.org/)

## Accessibility principles

When building your Hydrogen custom storefront, focus on the main principles of the WCAG 2.0 Guidelines:

* **Perceivable**: Information and UI components must be presentable to users in ways that they can perceive.
* **Operable**: UI components and navigation must be operable.
* **Understandable**: Information and the operation of the UI must be understandable.
* **Robust**: Content must be clear enough that it can be interpreted reliably by a wide variety of user agents, including assistive technologies.

The following sections provide a list of accessibility best practices for how merchants and customers interact with your Hydrogen custom storefront.

## Keyboard and gesture controls

Merchants and customers who have visual or motor impairments might use a keyboard to navigate and complete tasks online. These users rely on a visual indicator to communicate where their keyboard's focus is on a web page. Your storefront should allow for all links, buttons, dropdown navigation, and form controls to be controlled using a keyboard.

### Keyboard support

* The focus indicator is visible and consistent on active elements. When navigating with either the mouse or the keyboard, the focus indicator is apparent on active elements.
* The focus style is visible on the desktop when using a keyboard.
* Your storefront doesn't rely on a mouse hover action to be visible or accessible.
* The <kbd>Tab</kbd> key and <kbd>Shift</kbd> + <kbd>Tab</kbd> keys can be used to navigate your storefront.
* No sudden changes of context when a part of your storefront receives focus. For example, when navigating with a keyboard, focus shouldn't switch to something else when a control receives focus.

### Gesture support

* Zooming gestures, for example pinch to zoom, are always available.
* Any functionality that requires several fingers or complex gestures, for example navigating 3D models, should be available with a single tap or click.

## Page structure

The following sections provides best practices for specific elements of your Hydrogen custom storefront's page structure.

### Global

* The page `lang` attribute is set on the `html` element to help screen readers pronounce content in the correct accent and dialect.
* The viewport zoom is enabled. Your storefront shouldn't use the `maximum-scale` and `user-scalable=”no”` attributes.
* Skip link is available and visible when focused to provide quick access to page content by skipping past common content such as headers. Your storefront should include `tabindex="-1"` on the container for the main content to receive focus.
* The content flow is linear. Your storefront uses no `tabindex` attributes values other than `0` or `-1` and no `autofocus` attribute. Positive `tabindex` values in use and autofocus take the power away from the user by forcing a specific focus order. Let the user discover page content organically.

### Headings

* The HTML heading elements use heading markup. Your storefront uses heading tags (`h1` to `h6`) to communicate the organization of the content on the page.
* The heading tags are used in sequence. Your storefront shouldn't use headings for design but rather to set the logical order of content on the page.
* The `h1` element is used to identify the main topic of a page.

### Navigation

* The navigation areas are wrapped with the `nav` HTML element.
* `aria-current` is used to communicate the current page when traversing links.
* `role=”menu”` or `role=”menuitem”` aren't used for navigation.

### Drop-down menu navigation

* `aria-expanded` is used to communicate the state of collapsible navigation.
* `aria-controls` is used to convey to assistive technology that there's a visually-hidden container that the drop-down menu controls.
* `aria-current` is used to communicate the current location or page when traversing navigation items.
* <kbd>Enter</kbd> and <kbd>Space</kbd> keys are supported to open the drop-down menu. Your storefront should keep focus on the launcher control. The <kbd>Tab</kbd> key moves focus to the first item in the drop-down menu.
* The <kbd>Esc</kbd> key is supported to collapse the drop-down menu and return focus to the launcher control.

### Product information

* Product images include descriptive [alt text](https://ux.shopify.com/considerations-when-writing-alt-text-a9c1985a8204).
* Sale and regular prices are marked differently, both visually and by using markup for screen readers. Your storefront should use visually-hidden text to help discern the regular price from the sales price.
* If your storefront dynamically changes a product price and availability when different variants are selected, then the changes should also be communicated to screen readers.
* `aria-live` is used to communicate dynamic changes in the UI.

### Hardcoded content

* Consider building with translation and localization in mind from the start. Content is similar to visual styles in that it can be highly customizable in tone, audience, and language.
* Hydrogen components shouldn't include hardcoded content, such as **Add to cart** and **Remove from cart** strings.
* Content is provided to the component by the consumer using either children or props.

### Controls

* The [`Link` component](/components/framework/link/) is used to navigate between routes. Your storefront should use links for navigation, loading a new page, or shifting keyboard focus from one element to another.
* The `button` element is used for on-screen actions such as launching a modal window and sorting a data table.
* The destination of your link should be clear from the text alone.
* Links that open a new window include a warning. Your storefront should include a visual icon with alternative text to help screen reader and sighted, keyboard-only users understand that clicking the link opens a new window.

### Tables

* The `table` element is used for tables data.
* The `caption` element is used to help assistive technology identify that a table is being read.
* The `th` element is used for headers with `scope` attributes.
* The `scope="col"` element is used for column headers, and `scope="row"` for row headers.

### Forms

* All form fields include a label. Fields can use `aria-label`, the `.visuallyhidden` element, floating labels, or a visible label to label forms. Form inputs and controls have names that clearly state their purpose.
* Form inputs have labels with `for` attributes, including form labels in the app settings.
* Required inputs have the `required` attribute.
* Fields use the `autocomplete` attribute. Auto-complete helps people fill in form fields by using the data stored in their browser.

#### Form errors

* Focus is placed on the feedback message. Any errors returned as a result of completing or submitting a form are communicated to screen readers where possible and as soon as possible.
* Error messages are clear and descriptive.
* The `aria-describedby` attribute is applied to `input` elements which reference the error text container.
* Notifications, error messages, success messages are announced aloud. Critical information is announced by screen readers using `aria-live`.

## Media

Media can be distracting, disruptive, or unexpected. All the media in your storefront should adhere to the following best practices:

- Media controls should respect the user's `prefers-reduced-motion` browser setting.
- Media controls are marked up using native HTML elements. Make sure your storefront has a toggle state for buttons and range input for sliders.
- Media can be paused using the <kbd>Space</kbd> key.

### Images and icons

- The [`Image` component](/components/primitive/image/) is used to render an `image` for the Storefront API's [Image object](https://shopify.dev/api/storefront/reference/common-objects/image/).

### Video

- The [`Video` component](/components/primitive/video/) is used to render a `video` for the Storefront API's [Video object](https://shopify.dev/api/storefront/reference/products/video/).
- Closed captions are available.
- Descriptive audio is available.
- If an auto-playing video is required, including videos in slideshows, then the sound should be muted.
- Videos with audio aren't visually obstructed.
- The <kbd>Space</kbd> key can be used to pause and play the video.

### Audio

- Transcripts are available.
- Auto-playing audio can be paused.

## Color and contrast

When you add colors to your storefront's UI, make sure that all of your text is accessible to merchants and customers who are colorblind or have other visual impairments. These merchants and customers rely on adequate color contrast to visually differentiate one thing from another.

You can use an [online contrast ratio tool](https://contrast-ratio.com/) to check the contrast of the different parts of your storefront.

The content in your app should adhere to the best practices described in the [WCAG 1.4.3: Contrast (Minimum) (Level AA) standards](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html).

## Dynamic components

Dynamic components such as slideshows, predictive search, modal windows, and tabs can be complex and difficult to navigate. Use elements that can be interpreted by screen readers, provide context, and include keyboard functionality.

### Drawers and modals

* When a drawer or modal is opened, focus is moved to the element that labels the drawer or modal.
* Navigating with the keyboard stays within the open drawer or modal.
* The <kbd>Esc</kbd> key is supported to close drawers and modals, and returns keyboard focus to the launcher element.
* The role used to identify modals is `dialog`.

### Slideshows

* Content that plays automatically in a slideshow can be paused or stopped.
* Content in a slideshow can be accessed through next and previous buttons.

## Next steps

- Review the [Polaris guidelines for accessibility](https://polaris.shopify.com/foundations/accessibility).
- Learn how to design apps with [keyboard accessibility](https://www.shopify.com/partners/blog/keyboard-accessibility) in mind.
- Learn about [best practices for making your Hydrogen custom storefront performant](/tutorials/best-practices/performance/).
