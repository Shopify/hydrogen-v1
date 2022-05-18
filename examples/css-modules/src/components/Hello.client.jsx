import styles from './hello.module.css';

export default function Hello() {
  return (
    <div>
      <p className={styles.hello}>Hello</p>
    </div>
  );
}
