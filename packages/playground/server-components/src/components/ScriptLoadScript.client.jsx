import {useState, useEffect} from 'react';
import {loadScript} from '@shopify/hydrogen/experimental';

let loading = false;

export default function ScriptLoadScript({strategy}) {
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
        strategy,
      });
      if (script.status) {
        console.log('📦 Script loaded via loadScript({..})');
        setStatus('done');
      }
    })();
  }, [strategy]);

  return (
    <section className="loadScript">
      {status === 'loading' && <p>Loading...</p>}
      {status === 'error' && <p>Error...</p>}
      {status === 'done' && (
        <div style={{border: '1px solid black', padding: '1rem'}}>
          <small>
            Injected by load-script.
            <br />
            reload: <code>false</code>
            <br />
            strategy: <code>{strategy}</code>
          </small>
          <h2 style={{color: 'green'}}>
            Loaded load-script.js via {`loadScript({})`} 📦{' '}
          </h2>
        </div>
      )}
    </section>
  );
}
