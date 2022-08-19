import {TestErrorGQL} from '~/sections/TestErrorGQL.server';
import {TestMenu} from '~/sections/TestMenu.server';

export default function Subnav1() {
  return (
    <div className="border border-primary p-6">
      <TestMenu />
      <div className="border border-primary p-6">
        <p>Developer defined error message that only show up in DEV mode</p>
        <TestErrorGQL />
      </div>
    </div>
  );
}
