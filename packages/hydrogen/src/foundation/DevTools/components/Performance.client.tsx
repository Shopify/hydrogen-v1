import React, {useState} from 'react';
import {Navigation, NavigationListener} from '@shopify/react-performance';
import {Heading} from './Heading';

export function Performance() {
  const [navigations, setStateNavs] = useState<Navigation[]>([]);
  const navigationItems = navigations.map(
    ({start, target, duration}, index) => (
      <li
        style={{
          fontSize: '0.8em',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '0.5em',
        }}
        // eslint-disable-next-line react/no-array-index-key
        key={`${start}${target}--${index}`}
      >
        <span style={{fontFamily: 'monospace'}}>{target}</span>
        <Pill>{logMetricIf('Duration', duration)}</Pill>
      </li>
    )
  );

  return (
    <>
      <Heading>Performance</Heading>
      {navigationItems}
      <NavigationListener
        onNavigation={(navigation: Navigation) => {
          setStateNavs((navs) => [...navigations, ...navs, navigation]);
        }}
      />
    </>
  );
}

function logMetricIf(label: string, data: any | undefined) {
  return data && `${label} ${Math.round(data)}ms`;
}

const Pill = (props: PropsWithChildren) => (
  <span
    style={{
      fontWeight: 'bold',
      fontFamily: 'monospace',
      padding: '0.25em 1em',
      border: '1px solid',
      borderRadius: 8,
    }}
    {...props}
  />
);

interface PropsWithChildren {
  children: React.ReactNode;
}
