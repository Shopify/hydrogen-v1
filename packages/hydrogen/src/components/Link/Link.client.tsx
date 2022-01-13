import React from 'react';
import {Link as RRLink} from 'react-router-dom';

export function Link(props: any) {
  return import.meta.env.SSR ? (
    <a href={props.to} {...props} to={null} />
  ) : (
    <RRLink {...props} />
  );
}
