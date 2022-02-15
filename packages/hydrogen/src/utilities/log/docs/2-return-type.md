## Return type

Return an object with methods for logging information at different priorities:

| Log method      | Description                                                                       |
| --------------- | --------------------------------------------------------------------------------- |
| `log.trace()`   | The lowest priority logs. These logs are very verbose.                            |
| `log.debug()`   | The normal priority logs. Used internally for logging route timing information.   |
| `log.warn()`    | The high priority warnings that might or might not cause the application to fail. |
| `log.error()`   | The logging used for errors or invalid application state.                         |
| `log.fatal()`   | The logging used just prior to the process exiting.                               |
| `log.options()` | Options set on the logger                                                         |
