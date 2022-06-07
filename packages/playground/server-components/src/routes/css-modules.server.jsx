import {red} from '../style.module.css';
import CssModulesClient from '../components/CssModules.client';

export default function CssModules() {
  return (
    <>
      <h1>CSS Modules</h1>
      <div data-test="server" className={red}>
        something
      </div>
      <CssModulesClient />
    </>
  );
}
