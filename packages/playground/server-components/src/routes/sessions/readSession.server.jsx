import {useSession} from '@shopify/hydrogen';

export default function ReadSession() {
  const {someData} = useSession();
  return <h1>Session Data: {someData}</h1>;
}
