import {LoadWidget} from '../../components/LoadWidget.client';

export default function () {
  return (
    <>
      <p>Inject 3p script as module in the head</p>
      <LoadWidget
        url="https://www.googletagmanager.com/gtag/js?id=UA-IN-HEAD-MODULE"
        options={{
          in: 'head',
          module: true,
        }}
      />
    </>
  );
}
