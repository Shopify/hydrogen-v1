import {TeapotError, BadRequestError} from '@shopify/hydrogen';

export async function api(request, {params: {handle}}) {
  switch (handle) {
    case '418':
      throw new TeapotError(
        "I'm a teapot!",
        'The requested entity body is short and stout. Tip me over and pour me out.'
      );
    case '400':
      throw new BadRequestError('Bad request', 'This was bad');
  }
}
