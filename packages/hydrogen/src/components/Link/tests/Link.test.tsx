import {createBrowserHistory} from 'history';
import {nextTick} from 'process';
import React from 'react';
import {mountWithProviders} from '../../../utilities/tests/shopifyMount.js';
import {Link} from '../Link.client.js';

describe('<Link />', () => {
  it('renders an anchor tag', () => {
    const component = mountWithProviders(
      <Link to="/products/hydrogen" target="_blank">
        Link
      </Link>
    );

    expect(component).toContainReactHtml(
      '<a target="_blank" href="/products/hydrogen">Link</a>'
    );
  });

  it('renders default rel for external destinations', () => {
    const component = mountWithProviders(
      <Link to="https://something.com/products/hydrogen">Link</Link>
    );

    expect(component).toContainReactHtml(
      '<a rel="noreferrer noopener" href="https://something.com/products/hydrogen">Link</a>'
    );
  });

  it('overrides default rel for external destinations', () => {
    const component = mountWithProviders(
      <Link rel="bookmark" to="https://something.com/products/hydrogen">
        Link
      </Link>
    );

    expect(component).toContainReactHtml(
      '<a rel="bookmark" href="https://something.com/products/hydrogen">Link</a>'
    );
  });

  it('forwards the ref', (done) => {
    mountWithProviders(
      <Link
        to="/products/hydrogen"
        ref={(ref) => {
          try {
            expect(ref).toBeInstanceOf(HTMLAnchorElement);
            done();
          } catch (e) {
            done(e);
          }
        }}
      >
        Link
      </Link>
    );
  });

  it('navigates on click', (done) => {
    const history = createBrowserHistory();

    global.window.scrollTo = jest.fn();

    const unlisten = history.listen(({location}) => {
      try {
        expect(location.pathname).toBe('/products/hydrogen');
        nextTick(() => {
          expect(global.window.scrollTo).toBeCalledWith(0, 0);
          done();
        });
      } catch (e) {
        done(e);
      } finally {
        unlisten();
      }
    });

    const component = mountWithProviders(
      <Link to="/products/hydrogen">Link</Link>,
      {
        history,
      }
    );

    component.act(() => {
      component?.domNode?.click();
    });
  });

  it('does not scroll to top if restore is disabled', (done) => {
    const history = createBrowserHistory();

    global.window.scrollTo = jest.fn();

    const unlisten = history.listen(({location}) => {
      try {
        expect(location.pathname).toBe('/products/hydrogen');
        nextTick(() => {
          expect(global.window.scrollTo).not.toBeCalledWith(0, 0);
          done();
        });
      } catch (e) {
        done(e);
      } finally {
        unlisten();
      }
    });

    const component = mountWithProviders(
      <Link to="/products/hydrogen" scroll={false}>
        Link
      </Link>,
      {
        history,
      }
    );

    component.act(() => {
      component?.domNode?.click();
    });
  });

  it('updates server state on navigate', (done) => {
    global.window.scrollTo = jest.fn();

    const setServerProps = jest.fn();

    const component = mountWithProviders(
      <Link to="/products/hydrogen">Link</Link>,
      {
        setServerProps,
      }
    );

    component.act(() => {
      component?.domNode?.click();
    });

    setTimeout(() => {
      try {
        expect(setServerProps.mock.calls[0][0]).toStrictEqual({
          pathname: '/products/hydrogen',
          search: '',
        });
        done();
      } catch (e) {
        done(e);
      }
    });
  });

  it('forces a page reload', () => {
    const component = mountWithProviders(
      <Link reloadDocument to="/products/hydrogen">
        Link
      </Link>
    );

    component?.domNode?.click();
    expect(window.location.href).toBe('http://localhost/products/hydrogen');
  });

  it('forces a page reload on _blank', () => {
    const component = mountWithProviders(
      <Link target="_blank" to="/products/hydrogen">
        Link
      </Link>
    );

    component?.domNode?.click();
    expect(window.location.href).toBe('http://localhost/products/hydrogen');
  });
});
