## Return type

Return an object with methods for logging information at different priorities:

| Log method    | Priority                                                                       |
| ------------- | ------------------------------------------------------------------------------ |
| `log.trace()` | Lowest priority and very verbose.                                              |
| `log.debug()` | Normal logging priority. Used internally for logging route timing information. |
| `log.warn()`  | High priority warnings, that may or may not cause the application to fail.     |
| `log.error()` | Use when for errors or invalid application state                               |
| `log.fatal()` | Intended to be used just prior to the process exiting                          |
