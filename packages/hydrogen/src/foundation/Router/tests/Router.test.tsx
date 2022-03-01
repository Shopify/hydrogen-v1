import {IncomingMessage} from 'http';
import {mount} from '@shopify/react-testing';
import React, {ReactElement} from 'react';
import {Router} from '../Router.server';
import {Route} from '../Route.server';
import {ServerRequestProvider} from '../../ServerRequestProvider';
import {useParams} from '../useParams';
import {ServerComponentRequest} from '../../../framework/Hydration/ServerComponentRequest.server';

jest.mock('../../Boomerang/BoomerangPageTemplate.client', () => ({
  BoomerangPage: () => null,
}));
jest.mock('../../Boomerang/Boomerang.client', () => ({
  Boomerang: () => null,
}));

function renderRoutes(
  url: string,
  routes: Array<ReactElement> | ReactElement,
  serverProps = {}
) {
  //@ts-ignore
  const nodeRequest = new IncomingMessage();
  nodeRequest.url = url;
  const request = new ServerComponentRequest(nodeRequest);
  return mount(
    <ServerRequestProvider request={request} isRSC={false}>
      <Router fallback={<h1>Not found!</h1>} serverProps={serverProps}>
        {routes}
      </Router>
    </ServerRequestProvider>
  );
}

describe('Router', () => {
  it('Matches a root <Route>', () => {
    const wrapper = renderRoutes(
      '/',
      <Route path="/" page={<h1>Root Route</h1>} />
    );

    expect(wrapper.html()).toMatchInlineSnapshot(`"<h1>Root Route</h1>"`);
  });

  it('Only matches one route', () => {
    const wrapper = renderRoutes(
      '/',
      <>
        <Route path="/" page={<h1>Root Route</h1>} />
        <Route path="/" page={<h1>Root Route 2</h1>} />
      </>
    );

    expect(wrapper.html()).toMatchInlineSnapshot(`"<h1>Root Route</h1>"`);
  });

  it('Only matches last route', () => {
    const wrapper = renderRoutes(
      '/last',
      <>
        <Route path="/" page={<h1>Root Route</h1>} />
        <Route path="/last" page={<h1>Last Route</h1>} />
      </>
    );

    expect(wrapper.html()).toMatchInlineSnapshot(`"<h1>Last Route</h1>"`);
  });

  it('Matches routes in nested components', () => {
    function A() {
      return <B />;
    }
    function B() {
      return <Route path="/nested" page={<h1>Nested Route</h1>} />;
    }
    const wrapper = renderRoutes(
      '/nested',
      <>
        <Route path="/" page={<h1>Root Route</h1>} />
        <A />
      </>
    );

    expect(wrapper.html()).toMatchInlineSnapshot(`"<h1>Nested Route</h1>"`);
  });

  it('Matches routes with params', () => {
    const wrapper = renderRoutes(
      '/products/hydrogen',
      <Route path="/products/:handle" page={<h1>Hydrogen Route</h1>} />
    );

    expect(wrapper.html()).toMatchInlineSnapshot(`"<h1>Hydrogen Route</h1>"`);
  });

  it('Routes have access to route params', () => {
    function MyRoute() {
      const {handle} = useParams();
      return <h1>{handle}</h1>;
    }

    const wrapper = renderRoutes(
      '/products/hydrogen',
      <Route path="/products/:handle" page={<MyRoute />} />
    );

    expect(wrapper.html()).toMatchInlineSnapshot(`"<h1>hydrogen</h1>"`);
  });

  it('Renders fallback when no routes match', () => {
    const wrapper = renderRoutes(
      '/does-note-exist',
      // @ts-ignore
      <Route path="/" page={<h1>Should not show up</h1>} />
    );

    expect(wrapper.html()).toMatchInlineSnapshot(`"<h1>Not found!</h1>"`);
  });

  it('Routes get server state', () => {
    function MyRoute({someState}: {someState: string}) {
      return <h1>{someState}</h1>;
    }

    const wrapper = renderRoutes(
      '/products/hydrogen',
      // @ts-ignore
      <Route path="/products/:handle" page={<MyRoute />} />,
      {someState: 'some server state'}
    );

    expect(wrapper.html()).toMatchInlineSnapshot(
      `"<h1>some server state</h1>"`
    );
  });
});
