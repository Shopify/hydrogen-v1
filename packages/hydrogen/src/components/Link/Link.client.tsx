import React from 'react';
import {isServer} from '../../utilities';
import {Link as RRLink} from 'react-router-dom';

export function Link(props: any) {
  return isServer() ? (
    <a href={props.to} {...{...props, to: null}} />
  ) : (
    <RRLink {...props} />
  );
}
