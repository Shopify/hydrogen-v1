type Descriptor = Parameters<typeof Object.defineProperty>[2];

// Create objects with null prototypes for faster access
export function createObject<T extends {} = object>(
  properties: T,
  {
    prototype = null,
    ...descriptor
  }: {prototype?: any} & Exclude<Descriptor, 'value'> = {}
) {
  return Object.create(
    prototype,
    Object.entries(properties).reduce((acc, [key, value]) => {
      acc[key] = {enumerable: true, ...descriptor, value};
      return acc;
    }, {} as Record<string, Descriptor>)
  ) as T;
}
