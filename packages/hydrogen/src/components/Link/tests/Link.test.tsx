import {createBrowserHistory} from 'history';
import React from 'react';
import {mountWithProviders} from '../../../utilities/tests/shopifyMount';
import {Link} from '../Link.client';

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

  // TODO: Fix this
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
        done();
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
        expect(setServerProps.mock.calls[0][0]()).toStrictEqual({
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
