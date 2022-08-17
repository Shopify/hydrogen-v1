import {TestErrorWithPageWithFallback} from '~/sections/TestErrorPageWithFallback.server';
import {TestMenu} from '~/sections/TestMenu.server';

export default function Subnav3() {
  return (
    <div className="border border-primary p-6">
      <TestMenu />
      <div className="border border-primary p-6">
        <p>Fallback error message when a section fails</p>
        <TestErrorWithPageWithFallback />
      </div>
    </div>
  );
}
