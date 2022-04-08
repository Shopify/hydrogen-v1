const db = {
  counter: 0,
};

export async function api(request) {
  db.counter++;
  return new Request(request.url, {headers: request.headers, method: 'GET'});
}

export default function () {
  return (
    <>
      DB counter is <span id="counter">{db.counter}</span>
      <form action="/post-rsc" method="POST">
        <button id="increase">Increase DB counter</button>
      </form>
    </>
  );
}
