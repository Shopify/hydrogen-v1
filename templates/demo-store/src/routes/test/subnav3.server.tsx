import {TestMenuRSCOutlet} from './index.server';
import {TestClient} from '../../components/TestClient.client';

export default function Subnav3() {
  return (
    <div className="border border-primary p-6">
      <TestMenuRSCOutlet />
      <div className="border border-primary p-6">
        <p>Subnav 3</p>
        <TestClient defaultSelected="Test Client 3" />
      </div>
    </div>
  );
}
