import faker from 'faker';
import {
  UnitPriceMeasurementMeasuredUnit,
  UnitPriceMeasurementMeasuredType,
  UnitPriceMeasurement,
} from '../../storefront-api-types.js';

export function getUnitPriceMeasurement(
  unitPriceMeasurement: Partial<UnitPriceMeasurement> = {}
) {
  const measuredTypeToUnitMap = {
    WEIGHT: [
      UnitPriceMeasurementMeasuredUnit.Mg,
      UnitPriceMeasurementMeasuredUnit.G,
      UnitPriceMeasurementMeasuredUnit.Kg,
    ],
    VOLUME: [
      UnitPriceMeasurementMeasuredUnit.Ml,
      UnitPriceMeasurementMeasuredUnit.Cl,
      UnitPriceMeasurementMeasuredUnit.L,
      UnitPriceMeasurementMeasuredUnit.M3,
    ],
    LENGTH: [
      UnitPriceMeasurementMeasuredUnit.Mm,
      UnitPriceMeasurementMeasuredUnit.Cm,
      UnitPriceMeasurementMeasuredUnit.M,
    ],
    AREA: [UnitPriceMeasurementMeasuredUnit.M2],
  };
  const measuredType = faker.random.arrayElement([
    UnitPriceMeasurementMeasuredType.Weight,
    UnitPriceMeasurementMeasuredType.Volume,
    UnitPriceMeasurementMeasuredType.Area,
    UnitPriceMeasurementMeasuredType.Length,
  ]);
  const quantityUnit = faker.random.arrayElement(
    measuredTypeToUnitMap[measuredType]
  );
  const referenceUnit = faker.random.arrayElement(
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
