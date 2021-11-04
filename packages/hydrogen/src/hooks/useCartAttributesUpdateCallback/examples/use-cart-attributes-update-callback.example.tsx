import {useCart, useCartAttributesUpdateCallback} from '@shopify/hydrogen';

export function CartAttributesUpdate() {
    const {attributes} = useCart();
    const cartAttributesUpdate = useCartAttributesUpdateCallback();
    const [cartAttributes, setCartAttributes] = useState([...attributes]);

    useEffect(() => {
        cartAttributesUpdate([{key: 'color', value: 'blue'}, {key: 'message', value: 'hello world'}])
    }, [])

    useEffect(() => {
        setCartAttributes(attributes)
    }, [attributes])

    return (
        <>
            {cartAttributes.map(({key, value}, index) => {
                return (
                    <div key={key}>
                        <p>{key}</p>
                        <input
                            data-cart-attribute
                            value={value}
                            type="text"
                            onChange={(event) => {
                                const localCopy = [...cartAttributes];
                                localCopy[index] = { key, value: event.target.value };
                                setCartAttributes(localCopy);
                            }}
                        />
                    </div>
                );
            })}
            <button onClick={
                () => cartAttributesUpdate(
                    cartAttributes
                )
            }>Update Attributes</button>
        </>);
}
