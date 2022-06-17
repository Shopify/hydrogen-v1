import { useMemo } from 'react';
import { useShop } from '../../foundation';
import { getMeasurementAsParts, getMeasurementAsString } from '../../utilities';
export function useMeasurement(measurement, options = {}) {
    const { locale } = useShop();
    return useMemo(() => {
        return {
            localizedString: getMeasurementAsString(measurement, locale, options),
            parts: getMeasurementAsParts(measurement, locale, options),
            original: measurement,
        };
    }, [locale, measurement, options]);
}
