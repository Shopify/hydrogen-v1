const zeros = '00000000';
const tokenHash = 'xxxx-4xxx-xxxx-xxxxxxxxxxxx';

export function buildUUID(): string {
  let hash = '';

  try {
    const crypto: Crypto = window.crypto;
    const randomValuesArray = new Uint16Array(31);
    crypto.getRandomValues(randomValuesArray);

    // Generate a strong UUID
    let i = 0;
    hash = tokenHash
      .replace(/[x]/g, (c: string, ...args: any[]): string => {
        const r = randomValuesArray[i] % 16;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        i++;
        return v.toString(16);
      })
      .toUpperCase();
  } catch (err) {
    // crypto not available, generate weak UUID
    hash = tokenHash
      .replace(/[x]/g, (c: string, ...args: any[]): string => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      })
      .toUpperCase();
  }

  return `${hexTime()}-${hash}`;
}

export function hexTime(): string {
  // 32 bit representations of new Date().getTime() and performance.now()
  let dateNumber = 0;
  let perfNumber = 0;

  // Result of zero-fill right shift is always positive
  dateNumber = new Date().getTime() >>> 0;

  try {
    perfNumber = performance.now() >>> 0;
  } catch (err) {
    perfNumber = 0;
  }

  const output = Math.abs(dateNumber + perfNumber)
    .toString(16)
    .toLowerCase();

  return zeros.substr(0, 8 - output.length) + output;
}

export function stripGId(text = ''): number {
  return parseInt(stripId(text));
}

export function stripId(text = ''): string {
  return text.substring(text.lastIndexOf('/') + 1);
}

export function addDataIf(
  keyValuePairs: Record<string, string | number | Boolean>,
  formattedData: any
): any {
  Object.entries(keyValuePairs).forEach(([key, value]) => {
    if (value) {
      formattedData[key] = value;
    }
  });
  return formattedData;
}

function getNavigationTypeExperimental() {
  try {
    const navigationEntries =
      performance?.getEntriesByType &&
      performance?.getEntriesByType('navigation');

    if (navigationEntries && navigationEntries[0]) {
      //  https://developer.mozilla.org/en-US/docs/Web/API/PerformanceNavigationTiming
      const rawType = (
        window.performance.getEntriesByType('navigation')[0] as any
      )['type'];
      const navType = rawType && rawType.toString();

      return navType;
    }
  } catch (err) {
    // Do nothing
  }
  return undefined;
}

function getNavigationTypeLegacy() {
  try {
    if (
      PerformanceNavigation &&
      performance?.navigation?.type !== null &&
      performance?.navigation?.type !== undefined
    ) {
      //  https://developer.mozilla.org/en-US/docs/Web/API/Performance/navigation

      const rawType = performance.navigation.type;
      switch (rawType) {
        case PerformanceNavigation.TYPE_NAVIGATE:
          return 'navigate';
          break;
        case PerformanceNavigation.TYPE_RELOAD:
          return 'reload';
          break;
        case PerformanceNavigation.TYPE_BACK_FORWARD:
          return 'back_forward';
          break;
        default:
          return `unknown: ${rawType}`;
      }
    }
  } catch (err) {
    // do nothing
  }
  return undefined;
}

export function getNavigationType() {
  try {
    let navApi = 'PerformanceNavigationTiming';
    let navType = getNavigationTypeExperimental();
    if (!navType) {
      navType = getNavigationTypeLegacy();
      navApi = 'performance.navigation';
    }
    if (navType) {
      return [navType, navApi];
    } else {
      return ['unknown', 'unknown'];
    }
  } catch (err) {
    // do nothing
  }
  return ['error', 'error'];
}
