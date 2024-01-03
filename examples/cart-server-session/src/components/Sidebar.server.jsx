import {CartCount} from '~/components/CartCount.server';
import {SidebarToggle} from '~/components/SidebarToggle.server';

export function Sidebar({children}) {
  return (
    <aside
      style={{
        width: '375px',
        backgroundColor: 'black',
        color: 'white',
        position: 'fixed',
        right: '0px',
        top: '0px',
        height: '100%',
        transform: 'translateX(100%)',
        transition: 'transform .3s ease-in-out',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '.5rem 1rem',
        }}
      >
        <CartCount />
        <SidebarToggle color="white" open={true} />
      </div>

      {children}
    </aside>
  );
}
