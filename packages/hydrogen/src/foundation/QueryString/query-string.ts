/**
 * The `useServerState` hook allows you to [manage server state](/api/hydrogen/framework/server-state) when using Hydrogen as a React Server Component framework.
 *
 * ## Return value
 *
 * The `useServerState` hook returns an object with the following keys:
 *
 * | Key            | Description                                                                                                   |
 * | -------------- | ------------------------------------------------------------------------------------------------------------- |
 * | `serverState`    | The current server state.                                                                                      |
 * | `setServerState` | A function used to modify server state.                                                                       |
 * | `pending`        | Whether a [transition is pending](https://github.com/reactwg/react-18/discussions/41). |
 *
 */
export function setQueryStringParam(key: string, value: string) {
  const url = new URL(window.location.href);
  url.searchParams.set(key, value);
  window.history.pushState({}, '', url.href);
}
