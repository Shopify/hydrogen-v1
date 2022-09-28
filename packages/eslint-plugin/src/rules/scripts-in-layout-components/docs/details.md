## Rule details

This rule prevents using the `Script` tag with "beforeHydration" or "inWorker" loading strategies on files other than App.server.tsx to ensure the scripts are
run at any initial route.
