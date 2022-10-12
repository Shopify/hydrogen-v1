import React from 'react';
import {ScriptBeforeHydration} from './ScriptBeforeHydration.js';
import {ScriptPostHydration} from './ScriptPostHydration.client.js';
import {ScriptProps} from './types.js';

/**
  The `Script` component renders a <script /> tag in your document's <head /> or <body />.
**/
export function Script(props: ScriptProps): JSX.Element | null {
  const beforeHydration = props.load === 'beforeHydration';

  return beforeHydration ? (
    <ScriptBeforeHydration {...props} /> // beforeHydration
  ) : (
    <ScriptPostHydration {...props} /> // afterHydration, onIdle or inWorker
  );
}
