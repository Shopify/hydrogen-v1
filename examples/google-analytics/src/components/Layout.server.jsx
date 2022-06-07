import {GoogleAnalytics} from './GoogleAnalytics.client';

export default function Layout({children}) {
  return (
    <>
      {children}
      <GoogleAnalytics />
    </>
  );
}
