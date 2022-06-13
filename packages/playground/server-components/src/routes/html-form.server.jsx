import {CacheNone} from '@shopify/hydrogen';
const db = {
  counter: 0,
};

export async function api(request) {
  if (request.method !== 'POST') {
    throw new Error('This endpoint only supports POST method');
  }

  db.counter++;

  return new Request(request.url);
}

export default function ({response}) {
  response.cache(CacheNone());
  return (
    <>
      DB counter is <span id="counter">{db.counter}</span>
      <form action="/html-form" method="POST">
        <button id="increase">Increase DB counter</button>
      </form>
    </>
  );
}
