// Examples of **incorrect** code for this rule:

import {Button} from '@shopify/hydrogen';

export function SomeReactComponent() {
  useEffect(() => {
    const fetchData = async () => {
      const result = await fetch('https://my.api.com');
    };

    fetchData();
  }, []);

  return <Button>Click me</Button>;
}
