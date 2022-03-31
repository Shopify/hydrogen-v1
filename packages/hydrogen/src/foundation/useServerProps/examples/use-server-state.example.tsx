// For convenience, `setServerState` accepts arguments in the following ways:

// Update a top-level state property based on key
setServerState(key, value);

// Spread a new value object onto existing state
setServerState(newValue);

// Provide a callback function to update the state completely
setServerState((previousState) => object);
