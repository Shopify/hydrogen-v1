import React, {ComponentProps, useState, useEffect} from 'react';
import {ClientAnalytics} from '../../Analytics';
import {Performance} from './Performance.client';
import {Settings} from './Settings.client';

export interface Props {
  settings: ComponentProps<typeof Settings>;
  performance: ComponentProps<typeof Performance>;
}

interface Panel {
  content: string;
  panel: React.ReactNode;
  icon: React.ReactNode;
}

type Navigations = Props['performance']['navigations'];

interface Panels {
  performance: Panel;
  settings: Panel;
  graphql?: Panel;
}

export function Panels({settings}: Props) {
  const [selectedPanel, setSelectedPanel] = useState<number>(0);
  const [navigations, setNavigations] = useState<Navigations>([]);
  useEffect(() => {
    ClientAnalytics.subscribe(
      ClientAnalytics.eventNames.PERFORMANCE,
      ({
        response_start,
        navigation_start,
        first_contentful_paint,
        largest_contentful_paint,
        response_end,
        page_load_type,
        url,
        transfer_size,
      }) => {
        setNavigations([
          ...navigations,
          {
            ttfb: response_start - navigation_start,
            fcp: first_contentful_paint,
            lcp: largest_contentful_paint,
            duration: response_end - navigation_start,
            type: `${page_load_type} load`,
            size: transfer_size,
            url,
          },
        ]);
      }
    );
  }, [setNavigations, navigations]);

  const panels = getPanels({settings, performance: {navigations}});
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
                lineHeight: 2,
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

function getPanels({settings, performance}: Props) {
  const panels: Panels = {
    settings: {
      content: 'Settings',
      panel: <Settings {...settings} />,
      icon: '🎛',
    },
    performance: {
      content: 'Performance',
      panel: <Performance {...performance} />,
      icon: '⏱',
    },
  };

  return Object.keys(panels).map((key) => {
    return {...panels[key as keyof Panels], id: key};
  });
}
