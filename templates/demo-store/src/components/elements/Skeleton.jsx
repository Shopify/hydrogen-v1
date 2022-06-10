/**
 * A shared component and Suspense call that's used in `App.server.jsx` to let your app wait for code to load while declaring a loading state
 */
export default function LoadingFallback({width, height, children}) {
  return (
    <div width={width} height={height} className="rounded-lg bg-primary/10">
      {children}
    </div>
  );
}
