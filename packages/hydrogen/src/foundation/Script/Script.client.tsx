/**
  The `Script` component renders a <script /> tag
**/
import React from 'react';
import {ScriptBeforeHydration} from './ScriptBeforeHydration.js';
import {ScriptPostHydration} from './ScriptPostHydration.client.js';
import {type ScriptProps} from './loadScript.js';

export function Script(props: ScriptProps): JSX.Element | null {
  const beforeHydration = props.strategy === 'beforeHydration';

  return beforeHydration ? (
    <ScriptBeforeHydration {...props} /> // beforeHydration
  ) : (
    <ScriptPostHydration {...props} /> // afterHydration, onIdle or inWorker
  );
}
