import styles from '../style.module.css';

export default function CssModulesClient() {
  return (
    <div data-test="client" className={styles.red}>
      hi
    </div>
  );
}
