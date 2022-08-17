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
        <TestErrorGQL />
        <TestErrorWithPage />
        <TestErrorWithPageWithFallback />
      </div>
    </div>
  );
}
