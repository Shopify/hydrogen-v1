// Examples of **incorrect** code for this rule:

function MyComponent() {
  // eslint-disable-next-line hydrogen/prefer-script-component
  return <script async src="https://www.googletagmanager.com/gtm.js" />;
}
