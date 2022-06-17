import { useContext } from 'react';
import { ProductOptionsContext } from '../../components/ProductOptionsProvider/context';
export function useProductOptions() {
    const context = useContext(ProductOptionsContext);
    if (!context) {
        throw new Error(`'useProductOptions' must be a child of <ProductOptionsProvider/>`);
    }
    return context;
}
