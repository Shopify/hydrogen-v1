import { Measurement } from '../types';
export declare function getMeasurementAsString(measurement: Measurement, locale?: string, options?: Intl.NumberFormatOptions): string;
export declare function getMeasurementAsParts(measurement: Measurement, locale?: string, options?: Intl.NumberFormatOptions): Intl.NumberFormatPart[];
