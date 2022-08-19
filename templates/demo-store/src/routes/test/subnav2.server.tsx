import {TestErrorWithPage} from '~/sections/TestErrorPage.server';
import {TestMenu} from '~/sections/TestMenu.server';

export default function Subnav2() {
  return (
    <div className="border border-primary p-6">
      <TestMenu />
      <div className="border border-primary p-6">
        <p>Shows nothing when a section fails without fallback defined</p>
        <TestErrorWithPage />
      </div>
    </div>
  );
}
