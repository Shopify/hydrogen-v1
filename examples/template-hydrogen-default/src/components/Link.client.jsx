import {Image} from '@shopify/hydrogen/client';

export function Link({children}) {
  return (
    <div>
      {children}
      <Image src="lol.jpg" width={100} height={100} />
    </div>
  );
}

// export function Link({children}) {
//   return <div id="linkylink">{children}</div>;
// }
