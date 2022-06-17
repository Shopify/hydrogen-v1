import { SelectedOptions, OptionWithValues } from './types';
import type { ProductVariant as ProductVariantType } from '../../storefront-api-types';
import type { PartialDeep } from 'type-fest';
export declare function getAllOptionValues(variants: ProductVariantType[], option: string): string[];
export declare function getSelectedVariant(variants: PartialDeep<ProductVariantType>[], choices: SelectedOptions): PartialDeep<ProductVariantType> | undefined;
export declare function getOptions(variants: PartialDeep<ProductVariantType>[]): OptionWithValues[];
