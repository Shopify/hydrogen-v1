import styleSheet from '../../styles/custom-font.css';
import {Head} from '@shopify/hydrogen';

export function CustomFontLink() {
  return (
    <Head>
      <link rel="stylesheet" href={styleSheet} />
    </Head>
  );
}
