import {TestClient} from '../../components/TestClient.client';
import {TestMenu} from '~/sections/TestMenu.server';

export default function Test() {
  return (
    <div className="border border-primary p-6">
      <TestMenu />
      <div className="border border-primary p-6">
        <h3 className="text-lead font-bold mb-2">Overview</h3>
        <TestClient defaultSelected="Test Client 3" />
      </div>
    </div>
  );
}
