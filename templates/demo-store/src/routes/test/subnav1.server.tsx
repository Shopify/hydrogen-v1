import {TestMenu} from '~/sections/TestMenu.server';
import {TestClient} from '../../components/TestClient.client';

export default function Subnav1() {
  return (
    <div className="border border-primary p-6">
      <TestMenu />
      <div className="border border-primary p-6">
        <p>Subnav 1</p>
        <TestClient defaultSelected="Test Client 1" />
      </div>
    </div>
  );
}
