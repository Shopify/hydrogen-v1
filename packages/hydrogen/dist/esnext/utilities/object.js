// Create objects with null prototypes for faster access
export function createObject(properties, { prototype = null, ...descriptor } = {}) {
    return Object.create(prototype, Object.entries(properties).reduce((acc, [key, value]) => {
        acc[key] = { enumerable: true, ...descriptor, value };
        return acc;
    }, {}));
}
