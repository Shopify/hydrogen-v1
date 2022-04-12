import {Form} from '@shopify/hydrogen';

let count = 0;

export default function FormServer() {
  return (
    <Form action="/form" method="POST">
      <b>Count: {count}</b>
      <button type="submit">Increment</button>
    </Form>
  );
}

export async function api(request, {hydrate}) {
  count++;
  return hydrate('/form');
}
