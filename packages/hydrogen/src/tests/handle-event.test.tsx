import React from 'react';
import {Helmet} from 'react-helmet-async';
import renderHydrogen from '../entry-server';
import {ServerComponentRequest} from '../framework/Hydration/ServerComponentRequest.server';
import handleEvent from '../handle-event';

describe('handleEvent', () => {
  it('returns an app response', async () => {
    const request = new Request('https://localhost:3000');
    function App() {
      return (
        <div>
          <Helmet>
            <title>Hello</title>
          </Helmet>
          <h1>Hi</h1>
        </div>
      );
    }

    const response = await handleEvent(
      {},
      {
        request: new ServerComponentRequest(request),
        entrypoint: renderHydrogen(App),
        indexTemplate: '<html><head></head><body><div id="root"></div></body>',
      }
    );

    const output = await response?.text();

    expect(output).toContain('<h1>Hi</h1>');
  });
});
