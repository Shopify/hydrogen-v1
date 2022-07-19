import {LoadWidgets} from '../components/LoadWidget.client';

export default function useLoadScriptTest() {
  return (
    <>
      <p>Inject 3p scripts in the head and body</p>
      <LoadWidgets />
    </>
  );
}
