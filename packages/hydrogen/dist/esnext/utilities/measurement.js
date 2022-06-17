const UNIT_MAPPING = {
    // Dimension
    mm: 'millimeter',
    cm: 'centimeter',
    m: 'meter',
    in: 'inch',
    ft: 'foot',
    yd: 'yard',
    // Volume
    ml: 'milliliter',
    l: 'liter',
    us_fl_oz: 'fluid-ounce',
    us_gal: 'gallon',
    // Weight
    kg: 'kilogram',
    g: 'gram',
    lb: 'pound',
    oz: 'ounce',
};
export function getMeasurementAsString(measurement, locale = 'en-us', options = {}) {
    let measure = {
        value: measurement.value,
        unit: UNIT_MAPPING[measurement.unit],
    };
    if (measure.unit == null) {
        measure = convertToSupportedUnit(measurement.value, measurement.unit);
    }
    return new Intl.NumberFormat(locale, {
        ...options,
        unit: measure.unit,
        style: 'unit',
    }).format(measure.value);
}
export function getMeasurementAsParts(measurement, locale = 'en-us', options = {}) {
    let measure = {
        value: measurement.value,
        unit: UNIT_MAPPING[measurement.unit],
    };
    if (measure.unit == null) {
        measure = convertToSupportedUnit(measurement.value, measurement.unit);
    }
    return new Intl.NumberFormat(locale, {
        ...options,
        unit: measure.unit,
        style: 'unit',
    }).formatToParts(measure.value);
}
function convertToSupportedUnit(value, unit) {
    switch (unit) {
        case 'cl':
            return {
                value: value / 1000,
                unit: 'liter',
            };
        case 'm3':
            return {
                value: value * 1000,
                unit: 'liter',
            };
        case 'us_pt':
            return {
                value: value * 0.125,
                unit: 'gallon',
            };
        case 'us_qt':
            return {
                value: value * 0.5,
                unit: 'gallon',
            };
        case 'us_oz':
            return {
                value: value / 128,
                unit: 'gallon',
            };
        case 'imp_pt':
            return {
                value: value / 6.661,
                unit: 'gallon',
            };
        case 'imp_qt':
            return {
                value: value / 3.331,
                unit: 'gallon',
            };
        case 'imp_gal':
            return {
                value: value / 1.201,
                unit: 'gallon',
            };
        case 'imp_fl_oz':
            return {
                value: value * 0.96076,
                unit: 'fluid-ounce',
            };
        default:
            throw new Error(`Unit not supported: ${unit}`);
    }
}
