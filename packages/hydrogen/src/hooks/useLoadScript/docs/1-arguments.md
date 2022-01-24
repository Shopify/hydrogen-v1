## Arguments

The `useLoadScript` hook can take in two parameters:

| Parameter | Required | Description                                                                                                        |
| --------- | -------- | ------------------------------------------------------------------------------------------------------------------ |
| `url`     | Yes      | The URL string for the external script                                                                             |
| `options` | No       | An object that gets passed to the underlying `<script>` tag. Currently only supports `{module: true}` as an option |
