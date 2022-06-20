// This file is named `const` but really only deals with images
// Also not totally clear what these consts are doing
export const DEFAULT_GRID_IMG_LOAD_EAGER_COUNT = 4;
export const ATTR_LOADING_EAGER = 'eager';

// Also it's called `const` but is also exporting a function.
// Feels like mixing the chocolate with the peanut butter!
export function getImageLoadingPriority(
  index: number,
  maxEagerLoadCount = DEFAULT_GRID_IMG_LOAD_EAGER_COUNT,
) {
  // Love a ternary but I have no idea what's happening here
  return index < maxEagerLoadCount ? ATTR_LOADING_EAGER : undefined;
}
