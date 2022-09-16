# Ensure that `<Script load="beforeHydration | inWorker" />` tags are only allowed in App.server.tsx

Scripts with these loading strategies are executed only on first render. If a Script is placed on a route component, then it will only be loaded if the user first navigates to page.
