## Return value

The `useLoadScript` hook returns the following values that allow you to understand the state of the external script you are loading:

| Value     | Description                                                                                                                              |
| --------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `loading` | The script is still loading. Note that the script tag could be on the page but the resource has not fully loaded yet while in this state |
| `done`    | The script is fully loaded and ready to use                                                                                              |
| `error`   | There was an error loading the script                                                                                                    |
