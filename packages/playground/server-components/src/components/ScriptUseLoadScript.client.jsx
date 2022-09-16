import {useScript} from '@shopify/hydrogen/experimental';

export default function ScriptUseLoadScript({
  reload = false,
  load = 'afterHydration',
  src = '/scripts/cdn?script=use-load-script.js',
  target = 'body',
  id = 'use-load-script',
}) {
  // Load script as afterHydration in the <head />
  const status = useScript({
    src,
    id,
    target,
    load,
    reload,
  });

  return (
    <div style={{marginTop: '1rem'}} id={id}>
      {status === 'loading' && <p>Loading ScriptUseLoadScript...</p>}
      {status === 'error' && <p>Error ScriptUseLoadScript...</p>}
      {status === 'done' && (
        <div style={{border: '1px solid black', padding: '1rem'}}>
          <small>
            useLoadScript
            <br />
            target: <code>{target}</code>
            <br />
            reload: <code>{reload ? '✅' : '❌'}</code>
            <br />
            load: <code>{load === 'inWorker' ? '⚙️ inWorker' : load}</code>
          </small>
          <h2 style={{color: 'orange'}}>
            Loaded {id} via {`useLoadScript({..})`} 🔥{' '}
          </h2>
        </div>
      )}
    </div>
  );
}
