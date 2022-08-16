import {Profiler} from 'react';

const callback = (
  id,
  phase,
  actualTime,
  baseTime,
  startTime,
  commitTime,
  interactions
) => {
  console.log(`------------------`);
  console.log(`${id}'s ${phase} phase:`);
  console.log(`Actual time: ${actualTime}`);
  console.log(`Base time: ${baseTime}`);
  console.log(`Start time: ${startTime}`);
  console.log(`Commit time: ${commitTime}`);
  console.log(`interactions: ${interactions}`);
};

export default function ScriptProfiler({children}) {
  return (
    <Profiler id="Scripts" onRender={callback}>
      {children}
    </Profiler>
  );
}
