import React, {useState} from 'react';

import {Performance} from './Performance.client';
import {Settings} from './Settings.client';
import {GraphQL} from './GraphQL.client';

export interface Props {
  settings: {
    locale: string;
  };
}

interface Panel {
  content: string;
  panel: React.ReactNode;
  icon: React.ReactNode;
}

interface Panels {
  performance: Panel;
  settings: Panel;
  graphql: Panel;
}

export function Panels({settings}: Props) {
  const [selectedPanel, setSelectedPanel] = useState<number>(0);
  const panels = getPanels({settings});
  const panelComponents = panels.map((obj, index) => (
    <div
      key={obj.content}
      style={{display: selectedPanel === index ? 'block' : 'none'}}
    >
      {obj.panel}
    </div>
  ));

  return (
    <div style={{display: 'flex', height: '100%'}}>
      <div style={{borderRight: '1px solid', padding: '1em 0em'}}>
        {panels.map(({content, icon, id}, index) => {
          const active = selectedPanel === index;
          return (
            <button
              key={id}
              type="button"
              style={{
                padding: '0em 1.25em',
                fontWeight: active ? 'bold' : 'normal',
                display: 'flex',
                alignItems: 'center',
              }}
              onClick={() => setSelectedPanel(index)}
            >
              <span style={{paddingRight: '0.4em'}}>{icon}</span>
              <span style={{fontFamily: 'monospace'}}>{content}</span>
            </button>
          );
        })}
      </div>
      <div style={{padding: '1.25em', width: '100%'}}>
        {panelComponents[selectedPanel ? selectedPanel : 0]}
      </div>
    </div>
  );
}

function Panel({children}: {children: React.ReactNode}) {
  return <div>{children}</div>;
}

function getPanels({settings}: Props) {
  const panels: Panels = {
    settings: {
      content: 'Settings',
      panel: <Settings {...settings} />,
      icon: '🎛',
    },
    performance: {
      content: 'Performance',
      panel: <Performance />,
      icon: '⏱',
    },
    graphql: {
      content: 'GraphQL',
      panel: <GraphQL />,
      icon: '🌐',
    },
  };

  return Object.keys(panels).map((key) => {
    return {...panels[key as keyof Panels], id: key};
  });
}
