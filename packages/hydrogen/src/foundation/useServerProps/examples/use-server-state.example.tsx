// For convenience, `setServerProps` accepts arguments in the following ways:

// Update a top-level server component prop based on key
setServerProps(key, value);

// Spread a new value object onto existing props
setServerProps(newValue);

// Provide a callback function to update the state completely
setServerProps((previousProps) => object);
