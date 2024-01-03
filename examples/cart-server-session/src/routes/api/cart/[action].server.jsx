import {createCart, cartLinesAdd, cartLinesRemove, getCart} from '~/utils/cart';

export async function api(request, {session, queryShop, params, ...props}) {
  try {
    let body = {};
    const type = request.headers.get('content-type');
    const referer = new URL(request.headers.get('referer')).origin;
    const isFormRequest = type.includes('form-urlencoded');

    switch (request.method) {
      case 'GET':
        return new Response('Pong', {status: 200});

      case 'POST': {
        if (!isFormRequest) {
          return RedirectToOrigin(referer);
        }

        const formData = await request.formData();
        for (const entry of formData.entries()) {
          body[entry[0]] = entry[1];
        }

        let cart = null;

        // execute the correct POST action handler
        switch (params.action) {
          case 'get': {
            cart = await getCart({
              id: body.cartId,
            });
            break;
          }

          case 'create': {
            cart = await createCart({
              lines: [
                {
                  merchandiseId: body.merchandiseId,
                  quantity: JSON.parse(body.quantity),
                },
              ],
            });
            console.log('created cart', cart);

            break;
          }

          case 'linesAdd': {
            cart = await cartLinesAdd({
              cartId: body.cartId,
              lines: [
                {
                  merchandiseId: body.merchandiseId,
                  quantity: JSON.parse(body.quantity),
                },
              ],
            });
            // await sleep(2000);
            break;
          }

          case 'linesRemove': {
            cart = await cartLinesRemove({
              cartId: body.cartId,
              lineIds: JSON.parse(body.lineIds),
            });
            break;
          }

          default:
            console.log('Unsupported cart action provided', params.action);
            return RedirectToOrigin(referer);
        }

        const cartCount = (cart?.lines || []).reduce((acc, line) => {
          return acc + line.quantity;
        }, 0);

        console.log('\n\n\n\ncartCount', cartCount);

        // save cart to session
        await session.set('cartId', cart.id);
        await session.set('cartCount', cartCount);

        return RedirectToOrigin({referer, toggleSidebar: body.toggleSidebar});
      }

      default:
        console.log('Unsupported request method', request.method);
        return new Response('Error', {
          status: 404,
        });
    }
  } catch (error) {
    console.log('cart:api error', error.message);
    return new Response(error.message, {
      status: 400,
    });
  }
}

function RedirectToOrigin(
  {referer, toggleSidebar} = {referer: '/', toggleSidebar: 'off'}
) {
  return new Response(null, {
    status: 303,
    statusText: 'OK',
    headers: {
      Location: `${referer}${
        toggleSidebar === 'on' ? '?toggleSidebar=true' : ''
      }`,
    },
  });
}
