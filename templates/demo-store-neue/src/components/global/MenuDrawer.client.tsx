import {EnhancedMenu} from '~/lib/utils';
import {Text} from '~/components';
import {Drawer} from './Drawer.client';
import {Link} from '@shopify/hydrogen';

export function MenuDrawer({
  isOpen,
  onClose,
  menu,
}: {
  isOpen: boolean;
  onClose: () => void;
  menu: EnhancedMenu;
}) {
  return (
    <Drawer open={isOpen} onClose={onClose} openFrom="left">
      <div className="grid">
        <Drawer.Title>
          <h2 className="sr-only">Menu Drawer</h2>
        </Drawer.Title>
        <MenuMobileNav menu={menu} onClose={onClose} />
      </div>
    </Drawer>
  );
}

function MenuMobileNav({
  menu,
  onClose,
}: {
  menu: EnhancedMenu;
  onClose: () => void;
}) {
  return (
    <nav className="sm:px-12 px-4 sm:py-8 py-4 flex flex-col sm:space-y-6 space-y-4">
      {/* Top level menu items */}
      {(menu?.items || []).map((item) => (
        <Link key={item.id} to={item.to} target={item.target} onClick={onClose}>
          <Text as="span" size="copy">
            {item.title}
          </Text>
        </Link>
      ))}
    </nav>
  );
}
