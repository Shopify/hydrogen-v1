import {defineRSCOutlet, Link} from '@shopify/hydrogen';
import {TestClient} from '../../components/TestClient.client';

const TestMenu = () => {
  return (
    <div className="border border-notice p-6">
      <h3>Test</h3>
      <nav className="flex gap-12">
        <Link to="/test">Overview</Link>
        <Link to="/test/subnav1">Subnav 1</Link>
        <Link to="/test/subnav2">Subnav 2</Link>
        <Link to="/test/subnav3">Subnav 3</Link>
      </nav>
      <TestClient defaultSelected="Test Client 4" />
    </div>
  );
};

export const TestMenuRSCOutlet = defineRSCOutlet({
  outletName: 'TestMenuRSCOutlet',
  component: TestMenu,
});

export default function Test() {
  return (
    <div className="border border-primary p-6">
      <TestMenuRSCOutlet />
      <div className="border border-primary p-6">
        <p>Overview</p>
      </div>
    </div>
  );
}
