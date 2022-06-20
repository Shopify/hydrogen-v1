import {CartDetails} from '~/components/cart';
import {Drawer} from './Drawer.client';

export function CartDrawer({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <Drawer open={isOpen} onClose={onClose} heading="Cart" openFrom="right">
      <div className="grid">
        <Drawer.Title>
          <h2 className="sr-only">Cart Drawer</h2>
        </Drawer.Title>
        <CartDetails layout="drawer" onClose={onClose} />
      </div>
    </Drawer>
  );
}
