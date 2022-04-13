## Considerations

The following considerations apply to `fetchSync` in server and client components.

### `fetchSync` in server components

- Don't use `async/await` with the `fetchSync` helper provided by Hydrogen. Hydrogen wraps the native fetch call in a way that supports Suspense boundaries.
- Process the response contents with `json()` or `text()` helpers.

### `fetchSync` in client components

- Suspense boundaries in client components are rendered during server-side rendering (SSR). This means the fallback is streamed to the client while the fetch call runs.
- Data fetched on the server during SSR isn't serialized to the client. This means that your client `fetchSync` function will run twice during initial page load: once on the server and once on the client.
- Suspense boundaries inside client components rendered during a subsequent navigation are only rendered on the client - not on the server.
- If you include browser-only logic inside your client component Suspense boundary, which would otherwise fail on the server, then you should conditionally include the suspending component with a piece of client state activated by `useEffect` or with a user action: `{isLoaded && <Suspense><MyComponent></Suspense>}`.
