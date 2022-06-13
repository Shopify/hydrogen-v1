import React, {useEffect, useState} from 'react';
import type {DevServerMessage} from '../../../utilities/devtools';

export function GraphQL() {
  const [warnings, setWarnings] = useState<string[] | null>(null);

  useEffect(() => {
    if (import.meta.hot) {
      import.meta.hot.on('hydrogen', ({type, data}: DevServerMessage) => {
        if (type === 'warn') {
          setWarnings((state) => [...(state || []), data]);
        }
      });
    }
  }, []);

  console.log(warnings);
  const warningsMarkup = warnings
    ? // eslint-disable-next-line react/no-array-index-key
      warnings.map((war, i) => <li key={war + i}>{war}</li>)
    : null;
  return (
    <div>
      <ul
        style={{
          fontFamily: 'monospace',
          paddingTop: '1em',
          fontSize: '0.9em',
        }}
      >
        {warningsMarkup}
      </ul>
    </div>
  );
}
