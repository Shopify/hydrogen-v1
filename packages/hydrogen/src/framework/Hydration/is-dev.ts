// Move this to a different file so it can be mocked in Jest
// until import.meta is supported.

// @ts-ignore
export const isDev = import.meta.env.DEV;
