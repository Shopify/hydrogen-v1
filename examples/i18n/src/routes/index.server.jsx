import {Welcome} from '../components/Welcome.client';
import {LangSwitcher} from '../components/LangSwitcher.client';

export default function Home() {
  return (
    <div>
      <LangSwitcher />
      <Welcome />
    </div>
  );
}
