import * as styles from './hello.module.css';

export default function Hello() {
  const StyleTag = styles.default;

  return (
    <div>
      <StyleTag />
      <p className={styles.hello}>Hello</p>
    </div>
  );
}
