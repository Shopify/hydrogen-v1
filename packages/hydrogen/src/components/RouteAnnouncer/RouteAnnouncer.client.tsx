import React from "react";
import { useLocation } from "../../foundation/Router/BrowserRouter.client.js";

const hydrogenRouteAnnouncerStyles: React.CSSProperties = {
  border: 0,
  clip: "rect(0 0 0 0)",
  height: "1px",
  margin: "-1px",
  overflow: "hidden",
  padding: 0,
  position: "absolute",
  width: "1px",

  // https://medium.com/@jessebeach/beware-smushed-off-screen-accessible-text-5952a4c2cbfe
  whiteSpace: "nowrap",
  wordWrap: "normal",
};

export const RouteAnnouncer = React.memo(() => {
  const hydroLoc = useLocation();
  const [routeAnnouncement, setRouteAnnouncement] = React.useState("");

  // Only announce the path change, but not for the first load because screen
  // reader will do that automatically.
  const previouslyLoadedPath = React.useRef(hydroLoc.pathname);

  // Every time the path changes, announce the new page’s title following this
  // priority: first the document title (from head), otherwise the first h1, or
  // if none of these exist, then the pathname from the URL. This methodology is
  // inspired by Marcy Sutton’s accessible client routing user testing. More
  // information can be found here:
  // https://www.gatsbyjs.com/blog/2019-07-11-user-testing-accessible-client-routing/
  React.useEffect(() => {
    // If the path hasn't change, we do nothing.
    if (previouslyLoadedPath.current === hydroLoc.pathname) return;
    previouslyLoadedPath.current = hydroLoc.pathname;

    const pageHeader = document?.querySelector("h1");
    const content = pageHeader?.innerText ?? pageHeader?.textContent;

    setRouteAnnouncement(document?.title || content || hydroLoc.pathname);
  }, [hydroLoc.pathname]);

  return (
    <p
      aria-live="assertive" // Make the announcement immediately.
      id="___hydrogen-route-announcer___"
      role="alert"
      style={hydrogenRouteAnnouncerStyles}
    >
      {routeAnnouncement}
    </p>
  );
});

export default RouteAnnouncer;
