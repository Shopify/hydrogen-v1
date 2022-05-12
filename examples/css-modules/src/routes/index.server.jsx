import Hello from '../components/Hello.client';
import styles from './index.module.css';

export default function Index() {
  return (
    <div className={styles.wrapper}>
      <>
        <h1>Hi</h1>
        <Hello />
      </>
    </div>
  );
}
