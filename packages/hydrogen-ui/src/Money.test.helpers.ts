import {
  MoneyV2,
  UnitPriceMeasurement,
  UnitPriceMeasurementMeasuredUnit,
} from './storefront-api-types.js';
import {faker} from '@faker-js/faker';

export function getPrice(price: Partial<MoneyV2> = {}): MoneyV2 {
  return {
    currencyCode: price.currencyCode ?? 'CAD',
    amount: price.amount ?? faker.finance.amount(),
  };
}

export function getUnitPriceMeasurement(
  unitPriceMeasurement: Partial<UnitPriceMeasurement> = {}
): UnitPriceMeasurement {
  const measuredTypeToUnitMap: {
    WEIGHT: UnitPriceMeasurementMeasuredUnit[];
    VOLUME: UnitPriceMeasurementMeasuredUnit[];
    LENGTH: UnitPriceMeasurementMeasuredUnit[];
    AREA: UnitPriceMeasurementMeasuredUnit[];
  } = {
    WEIGHT: ['MG', 'G', 'KG'],
    VOLUME: ['ML', 'CL', 'L', 'M3'],
    LENGTH: ['MM', 'CM', 'M'],
    AREA: ['M2'],
  };
  const measuredType = faker.helpers.arrayElement<
    keyof typeof measuredTypeToUnitMap
  >(['WEIGHT', 'VOLUME', 'AREA', 'LENGTH']);
  const quantityUnit = faker.helpers.arrayElement(
    measuredTypeToUnitMap[measuredType]
  );
  const referenceUnit = faker.helpers.arrayElement(
    measuredTypeToUnitMap[measuredType]
  );

  return {
    measuredType: unitPriceMeasurement.measuredType ?? measuredType,
    quantityUnit: unitPriceMeasurement.quantityUnit ?? quantityUnit,
    quantityValue: unitPriceMeasurement.quantityValue ?? faker.datatype.float(),
    referenceUnit: unitPriceMeasurement.referenceUnit ?? referenceUnit,
    referenceValue:
      unitPriceMeasurement.referenceValue ?? faker.datatype.number(),
  };
}
