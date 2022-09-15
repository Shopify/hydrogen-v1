import {useState, useEffect} from 'react';
import {loadScript} from '@shopify/hydrogen/experimental';

let loading = false;

export default function ScriptLoadScript({load}) {
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    if (loading) {
      return;
    }
    loading = true;
    (async () => {
      const script = await loadScript({
        src: '/scripts/cdn?script=load-script.js',
        id: 'load-script',
        load,
      });
      if (script.status) {
        console.log('📦 Script loaded via loadScript({..})');
        setStatus('done');
      }
    })();
  }, [load]);

  return (
    <section className="loadScript" style={{marginTop: '1rem'}}>
      {status === 'loading' && <p>Loading...</p>}
      {status === 'error' && <p>Error...</p>}
      {status === 'done' && (
        <div style={{border: '1px solid black', padding: '1rem'}}>
          <small>
            Injected by load-script.
            <br />
            reload: <code>false</code>
            <br />
            load: <code>{load}</code>
          </small>
          <h2 style={{color: 'green'}}>
            Loaded load-script.js via {`loadScript({})`} 📦{' '}
          </h2>
        </div>
      )}
    </section>
  );
}
