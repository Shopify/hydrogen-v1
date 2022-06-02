import {GoogleAnalytics} from './GoogleAnalytics.client';

export default function Layout({children}) {
  return (
    <>
      <GoogleAnalytics />
      {children}
    </>
  );
}
