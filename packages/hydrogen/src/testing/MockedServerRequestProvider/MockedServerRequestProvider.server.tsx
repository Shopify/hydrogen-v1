import React from 'react';
import {ServerRequestProvider} from '../../foundation/ServerRequestProvider/ServerRequestProvider.js';
import {HydrogenRequest} from '../../foundation/HydrogenRequest/HydrogenRequest.server.js';

interface MockedServerRequestProviderProps {
  request?: HydrogenRequest;
  children: React.ReactElement;
}

export function MockedServerRequestProvider(
  props: MockedServerRequestProviderProps
) {
  let request: HydrogenRequest;

  if (props.request) {
    request = props.request;
  } else {
    request = new HydrogenRequest(new Request('https://examples.com'));
  }
  return (
    <ServerRequestProvider request={request}>
      {props.children}
    </ServerRequestProvider>
  );
}
