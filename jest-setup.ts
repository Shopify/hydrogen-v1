// @ts-nocheck
import '@shopify/react-testing';
import '@shopify/react-testing/matchers';
import './scripts/polyfillWebRuntime';

// TODO remove all these mocks when @shopify/react-testing supports React 18 experimental

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

globalThis.scrollTo = () => null;

jest.mock('react-dom', () => {
  const reactDom = jest.requireActual('react-dom');
  const reactDomClient = jest.requireActual('react-dom/client');

  return {
    ...reactDom,
    render: (app, container) => {
      // @ts-ignore
      const root = reactDomClient.createRoot(container);
      container.__unmount = root.unmount.bind(root);
      root.render(app);
    },
    unmountComponentAtNode(container) {
      container.__unmount();
    },
  };
});

jest.mock('@shopify/react-testing/build/cjs/compat.js', () => {
  return {
    getInternals: (instance: any) => {
      const internals = instance._reactInternals;

      if (internals) {
        internals.alternate = internals.alternate || internals;
      }

      return internals;
    },
  };
});
