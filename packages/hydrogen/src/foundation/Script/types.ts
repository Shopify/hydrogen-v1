import {ScriptHTMLAttributes} from 'react';

export type ScriptState = 'loading' | 'done' | 'error';
export type ScriptTarget = 'head' | 'body';
export type ScriptLoad =
  | 'beforeHydration'
  | 'afterHydration'
  | 'onIdle'
  | 'inWorker';

/* Ensure that either `src`, `children` or `dangerouslySetInnerHTML` is set, but not any combination of them */
type InlineProps =
  | {
      dangerouslySetInnerHTML: {__html: string};
      children?: never;
      src?: never;
    }
  | {
      children: React.ReactNode;
      dangerouslySetInnerHTML?: never;
      src?: never;
    }
  | {
      children?: never;
      dangerouslySetInnerHTML?: never;
      src: string;
    };

/* All scripts share these props */
type BaseProps = {
  children?: React.ReactNode;
  src?: string;
} & InlineProps &
  Omit<
    ScriptHTMLAttributes<HTMLScriptElement>,
    'onLoad' | 'onError' | 'onReady'
  >;

export type BeforeHydrationProps = {
  id: string; // required as it will be used as key
  load: 'beforeHydration';
  target?: never;
  reload?: never;
  onLoad?: never;
  onError?: never;
  onReady?: never;
} & BaseProps;

export type PostHydrationProps = {
  id?: string; // required as it will be used as key
  onError?: (e: any) => void;
  /* Event emitted when the script is loaded */
  onLoad?: (e: Event) => void;
  /* Event emitted when the script is ready */
  onReady?: (e?: any) => void;
  /* Simulates MPA architecture force reloading the script on every navigation */
  reload?: boolean;
  /* defines the loading mechanism in relation to the main loop */
  load?: Exclude<ScriptLoad, 'beforeHydration'>;
  /* where to insert the script tag */
  target?: ScriptTarget;
} & BaseProps;

export type ScriptProps = BeforeHydrationProps | PostHydrationProps;

export type ScriptResponse = {
  /* whether the script was loaded */
  status: boolean;
  /* the onload/onerror event if one occurred */
  event: Event | string;
};

export type ScriptCacheProps = {
  script: HTMLScriptElement;
  promise: Promise<ScriptResponse>;
};

export type UseScriptProps = {
  /* `beforeHydration`  is not allowed because the hook is stateful e.g postHydration  */
  load?: Exclude<PostHydrationProps['load'], 'beforeHydration' | 'worker'>;
} & PostHydrationProps;
