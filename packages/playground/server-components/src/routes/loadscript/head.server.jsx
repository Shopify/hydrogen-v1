import {LoadWidget} from '../../components/LoadWidget.client';

export default function () {
  return (
    <>
      <p>Inject 3p script in the head</p>
      <LoadWidget
        url="https://www.googletagmanager.com/gtag/js?id=UA-IN-HEAD"
        options={{
          in: 'head',
        }}
      />
    </>
  );
}
