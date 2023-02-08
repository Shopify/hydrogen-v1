# Sessions


> ⚠️ **Important:** [Hydrogen 2.0](https://hydrogen.shopify.dev) is out now. These archival Hydrogen 1.0 docs are provided only to assist developers during their upgrade process. Please migrate to Hydrogen 2.0 as soon as possible.

<aside class="note beta">
<h4>Experimental feature</h4>

<p>Session management is an experimental feature. As a result, functionality is subject to change. You can provide feedback on this feature by <a href="https://github.com/Shopify/hydrogen/issues">submitting an issue in GitHub</a>.</p>

</aside>

A session is a set of user interactions that take place within a given timeframe. Each session tracks the global data that's unique to each user.

The Hydrogen framework includes built-in support for session management. This guide provides an introduction to how sessions work in your Hydrogen app.

For example, session data might contain the products within a cart, site preferences, and user identity. Session data persists across page refreshes, but it eventually expires, depending on how it's configured.

## Types of session storage

The following table describes the types of session storage available by default in Hydrogen:

| Type                      | Component                                                                                          | Description                                                                                                                                                                                                                                                                                                                                                                         |
| ------------------------- | -------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Cookie session storage    | [CookieSessionStorage](/docs/components/framework/cookiesessionstorage.md) | The default session storage mechanism for Hydrogen. Cookies are convenient because you don't need a database or another backend service to persist the data.                                                                                                                                                                                                                        |
| In-memory session storage | [MemorySessionStorage](/docs/components/framework/memorysessionstorage.md) | Stores the session data within Hydrogen runtime memory. You still need to configure cookies because a unique session ID is stored within the browser cookie, even though associated session data is stored in memory.                                                                                                                                                               |
| File session storage      | [FileSessionStorage](/docs/components/framework/filesessionstorage.md)     | Persists session data to the file system. This is useful if you need to store a lot of data in the session (more than the 4kb cookie limit.md) and also have the data persist when Hydrogen restarts. <br></br>Cookie configuration is still necessary because a unique session ID is stored within the browser cookie, although associated session data is stored in the file system. |

## Configuring sessions

The [Demo Store template](/docs/tutorials/getting-started/templates.md) comes pre-configured with session support.

By default, session data is persisted within a cookie. You can adjust the session cookie configuration within your Hydrogen configuration file for an in-memory storage or file-based storage (NodeJS only), or build your own storage adapter. [Learn how](/docs/tutorials/sessions/manage-sessions.md).

## Related components and hooks

- [`Cookie`](/docs/components/framework/cookie.md)
- [`CookieSessionStorage`](/docs/components/framework/cookiesessionstorage.md)
- [`MemorySessionStorage`](/docs/components/framework/memorysessionstorage.md)
- [`FileSessionStorage`](/docs/components/framework/filesessionstorage.md)
- [`useSession`](/docs/hooks/framework/usesession.md)

## Next steps

- Learn how to perform common tasks for [managing sessions in Hydrogen](/docs/tutorials/sessions/manage-sessions.md).
