import {TimingCache} from './loadScript.js';

export function logScriptPerformance(key: string, src: string | undefined) {
  if (!src) return;

  let loadTime = 0;
  if (TimingCache.has(key)) {
    const start = TimingCache.get(key)?.start;
    if (start) {
      loadTime = start;
    }
  }
  const durationNoThrottle = Math.ceil(performance.now() - loadTime);
  const duration4G = durationNoThrottle * 6; // ~6x slower than no throttle
  const duration = duration4G;
  // console.log(`📡 ${src} ${durationNoThrottle}ms ${duration4G}ms`);

  const time = duration > 1000 ? `${duration / 1000}s` : `${duration}ms`;
  const score = duration > 500 ? 'bad' : duration > 375 ? 'ok' : 'good';
  const colors = {
    good: 'color: green',
    ok: 'color: yellow',
    bad: 'color: red',
  };
  const color = colors[score];

  if (score !== 'good') {
    console.log(
      `%cSlow script detected:\nsrc: ${src}\nduration: ${time}`, // Console Message
      color
    );
  }
}
