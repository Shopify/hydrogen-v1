import {TestMenu} from '~/sections/TestMenu.server';

export default function Test() {
  return (
    <div className="border border-primary p-6">
      <TestMenu />
      <div className="border border-primary p-6">
        <p>Overview</p>
      </div>
    </div>
  );
}
