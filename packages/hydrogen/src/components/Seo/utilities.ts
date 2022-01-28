export function checkInvalidOverride(
  props: Object,
  validOverrides: {baseProp: string; validProps: string[]}[]
) {
  let baseProp: string | undefined;
  const invalidOverride: string[] = [];

  Object.keys(props).forEach((basePropKey: string) => {
    const validOverride = validOverrides.find(
      (el) => el.baseProp === basePropKey
    );

    if (validOverride) {
      Object.entries(props).forEach(([validPropKey, propToCheck]) => {
        if (
          basePropKey !== validPropKey &&
          Boolean(propToCheck) &&
          !validOverride.validProps.includes(validPropKey) &&
          (baseProp === undefined || baseProp === validOverride.baseProp)
        ) {
          baseProp = validOverride.baseProp;
          invalidOverride.push(validPropKey);
        }
      });
    }
  });

  if (baseProp && invalidOverride.length > 0) {
    let invalidCases;
    if (invalidOverride.length == 1) {
      invalidCases = `${baseProp} and ${invalidOverride[0]}`;
    } else {
      const lastOverride = invalidOverride.pop();
      invalidCases = `${[baseProp, ...invalidOverride].join(
        ', '
      )} and ${lastOverride}`;
    }

    console.warn(
      `Using <Seo/> with props ${invalidCases} will result in un-intentional override Seo values. Please check the documentation for the combination of props that is recommended.`
    );
  }
}
