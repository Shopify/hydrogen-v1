import styles from './hello.module.css';

export default function Hello() {
  return (
    <div>
      <styles.StyleTag />
      <p className={styles.hello}>Hello</p>
    </div>
  );
}
