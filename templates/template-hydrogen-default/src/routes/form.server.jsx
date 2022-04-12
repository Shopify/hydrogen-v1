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

export async function api(request) {
  count++;
  return new Request(request.url);
}
