import {Link} from '@shopify/hydrogen';

import {Button, Heading, Text} from '~/components';

export function CartEmpty({onClose}: {onClose: () => void}) {
  return (
    <div className="flex flex-col space-y-7 justify-center items-center md:py-8 md:px-12 px-4 py-6 h-screen">
      <Heading>Your cart is empty</Heading>
      <Button onClick={onClose}>Continue shopping</Button>
      <div className="flex flex-col text-center">
        <Text>Have an account?</Text>
        <Text>
          <Link
            className="text-orange-600 underline"
            onClick={onClose}
            to="/account/register"
          >
            Join
          </Link>{' '}
          or{' '}
          <Link
            className="text-orange-600 underline"
            onClick={onClose}
            to="/account/login"
          >
            login
          </Link>{' '}
          for smoother checkout.
        </Text>
      </div>
    </div>
  );
}
