import {TestErrorGQL} from '~/sections/TestErrorGQL.server';
import {TestMenu} from '~/sections/TestMenu.server';

export default function Subnav1() {
  return (
    <div className="border border-primary p-6">
      <TestMenu />
      <div className="border border-primary p-6">
        <p>Default error message when a query in a section fails</p>
        <TestErrorGQL />
      </div>
    </div>
  );
}
