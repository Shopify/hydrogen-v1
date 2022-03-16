import Hello from '../components/Hello.client';
import * as styles from './index.module.css';

export default function Index() {
  return (
    <div className={styles.wrapper}>
      <styles.default />
      <h1>Hi</h1>
      <Hello />
    </div>
  );
}
