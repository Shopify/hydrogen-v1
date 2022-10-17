import React from 'react';
import {ServerRequestProvider} from '../../foundation/ServerRequestProvider/ServerRequestProvider.js';
import {ServerPropsProvider} from '../../foundation/ServerPropsProvider/ServerPropsProvider.js';
import {HydrogenRequest} from '../../foundation/HydrogenRequest/HydrogenRequest.server.js';
import {ShopifyProviderOptions} from '../../utilities/tests/provider-helpers.js';

export function MockedServerRequestProvider({
  children,
  setServerProps = () => {},
  serverProps = {pathname: '', search: ''},
  requestUrl = 'https://examples.com',
}: Omit<ShopifyProviderOptions, 'history'> & {
  children: React.ReactElement;
  requestUrl?: string;
}) {
  const request = new HydrogenRequest(new Request(requestUrl));

  return (
    <ServerRequestProvider request={request}>
      <ServerPropsProvider
        setServerPropsForRsc={setServerProps}
        initialServerProps={serverProps}
        setRscResponseFromApiRoute={() => {}}
      >
        {children}
      </ServerPropsProvider>
    </ServerRequestProvider>
  );
}
