import {useServerState} from '@shopify/hydrogen/client';

export default function ReadServerState() {
  const {serverState} = useServerState();

  return (
    <div>
      <p id="server-state">Pathname: {serverState.pathname}</p>
    </div>
  );
}
