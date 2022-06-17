import { Measurement } from '../../types';
export interface UseMeasurementValue {
    localizedString: string;
    amount?: string;
    unitName?: string;
    parts: Intl.NumberFormatPart[];
    original: Measurement;
}
export declare function useMeasurement(measurement: Measurement, options?: Omit<Intl.NumberFormatOptions, 'unit'>): UseMeasurementValue;
