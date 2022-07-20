import {RSCSubRoute} from '@shopify/hydrogen';

import HeaderMenu from '../../routes/sub-routes/HeaderMenu.server';
import FooterMenu from '../../routes/sub-routes/FooterMenu.server';

/**
 * A server component that defines a structure and organization of a page that can be used in different parts of the Hydrogen app
 */
export function Layout({children}: {children: React.ReactNode}) {
  return (
    <>
      <div className="flex flex-col min-h-screen">
        <div className="">
          <a href="#mainContent" className="sr-only">
            Skip to content
          </a>
        </div>

        <RSCSubRoute
          state={{}}
          path="sub-routes/HeaderMenu"
          page={<HeaderMenu />}
        />

        <main role="main" id="mainContent" className="flex-grow">
          {children}
        </main>
      </div>
      <RSCSubRoute
        state={{}}
        path="sub-routes/FooterMenu"
        page={<FooterMenu />}
      />
    </>
  );
}
