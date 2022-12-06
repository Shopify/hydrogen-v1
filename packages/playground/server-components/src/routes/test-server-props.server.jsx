import ReadServerProps from '../components/ReadServerProps.client';

export default function TestServerProps({message}) {
  return (
    <div>
      <h1>Test Server Props</h1>
      <div id="server-comp-server-props">Server: {JSON.stringify(message)}</div>
      <ReadServerProps />
    </div>
  );
}
