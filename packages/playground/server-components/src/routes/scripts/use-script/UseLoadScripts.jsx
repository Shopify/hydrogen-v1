import ScriptUseLoadScript from '../../../components/ScriptUseLoadScript.client';

export default function () {
  return (
    <>
      {/* afterHydration  */}
      <ScriptUseLoadScript
        id="use-load-script-after-hydration"
        load="afterHydration"
        src="/scripts/cdn?script=use-load-script-after-hydration.js"
      />

      <ScriptUseLoadScript
        id="use-load-script-after-hydration-reload"
        reload={true}
        load="afterHydration"
        src="/scripts/cdn?script=use-load-script-after-hydration-reload.js"
      />

      {/* onIdle */}
      <ScriptUseLoadScript
        id="use-load-script-on-idle-reload"
        reload={true}
        load="onIdle"
        src="/scripts/cdn?script=use-load-script-on-idle-reload.js"
      />
    </>
  );
}
