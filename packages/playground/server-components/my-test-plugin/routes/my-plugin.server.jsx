export default function MyPlugin() {
  return <h1>Hello My Plugin</h1>;
}

export function api() {
  return new Response('Plugin OK');
}
