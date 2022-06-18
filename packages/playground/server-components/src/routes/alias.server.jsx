// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable node/no-missing-import */
import Alias1 from '~/components/Alias.client';
import Alias2 from '@/components/Alias.client';
import Alias3 from '/src/components/Alias.client';

export default function Env() {
  return (
    <>
      <h1>Aliases</h1>

      <Alias1 />
      <Alias2 />
      <Alias3 />
    </>
  );
}
