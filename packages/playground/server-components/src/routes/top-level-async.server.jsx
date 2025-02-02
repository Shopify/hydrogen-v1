export default function topLevelAsync({response}) {
  response.doNotStream();
  return <div>Hello!</div>;
}
