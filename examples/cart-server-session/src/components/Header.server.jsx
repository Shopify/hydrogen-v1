import {SidebarToggle} from '~/components/SidebarToggle.server';
import {CartCount} from '~/components/CartCount.server';

export function Header({children, toggleSidebar}) {
  return (
    <header>
      <div
        id="header__container"
        style={{
          display: 'flex',
          gap: '1rem',
          alignItems: 'center',
        }}
      >
        <SidebarToggle open={toggleSidebar} />

        <strong>Cart Session + Server Demo</strong>

        <CartCount />

        {/* Sidebar will render here */}
        {children}
      </div>
      <hr />
    </header>
  );
}
