import {useMemo} from 'react';
import {useLocalization} from '../useLocalization/useLocalization';
import {getMeasurementAsParts, getMeasurementAsString} from '../../utilities';
import {Measurement} from '../../types';

export interface UseMeasurementValue {
  localizedString: string;
  amount?: string;
  unitName?: string;
  parts: Intl.NumberFormatPart[];
  original: Measurement;
}

export function useMeasurement(
  measurement: Measurement,
  options: Omit<Intl.NumberFormatOptions, 'unit'> = {}
): UseMeasurementValue {
  const {locale} = useLocalization();

  return useMemo(() => {
    return {
      localizedString: getMeasurementAsString(measurement, locale, options),
      parts: getMeasurementAsParts(measurement, locale, options),
      original: measurement,
    };
  }, [locale, measurement, options]);
}
