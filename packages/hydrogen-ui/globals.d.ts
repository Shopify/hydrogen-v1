// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-var */

// This file is only intended to help TS with global types for our project, and not for custom-created types

/**
 * Will be `true` in the development builds of Hydrogen, and `false` in the production builds. Useful for dev-only warnings or messages.
 *
 * Critial errors should still be thrown outside of a `__HYDROGEN_DEV__`check, so that the errors are still logged in production scenarios.
 */
declare var __HYDROGEN_DEV__: boolean;
