import {TestErrorGQL} from '~/sections/TestErrorGQL.server';
import {TestErrorWithPage} from '~/sections/TestErrorPage.server';
import {TestErrorWithPageWithFallback} from '~/sections/TestErrorPageWithFallback.server';
import {TestMenu} from '~/sections/TestMenu.server';

export default function Subnav3() {
  return (
    <div className="border border-primary p-6">
      <TestMenu />
      <div className="border border-primary p-6">
        <p>All sections with error in a route</p>
        <div className="border border-primary p-6">
          <p>Developer defined error message that only show up in DEV mode</p>
          <TestErrorGQL />
        </div>
        <div className="border border-primary p-6">
          <p>Shows nothing when a section fails without fallback defined</p>
          <TestErrorWithPage />
        </div>
        <div className="border border-primary p-6">
          <p>Fallback error message when a section fails</p>
          <TestErrorWithPageWithFallback />
        </div>
      </div>
    </div>
  );
}
