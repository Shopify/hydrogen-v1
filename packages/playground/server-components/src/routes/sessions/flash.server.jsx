import {useFlashSession} from '@shopify/hydrogen';

export default function Flash() {
  const someData = useFlashSession('someData');
  return <h1>Session Data: {someData}</h1>;
}
