import {MetaPixel} from './MetaPixel.client';

export default function Layout({children}) {
  return (
    <>
      {children}
      <MetaPixel />
    </>
  );
}
