import moduleEntry from './worker';
// @ts-ignore
addEventListener('fetch', (event) => event.respondWith(moduleEntry.fetch(event.request, globalThis, event)));
