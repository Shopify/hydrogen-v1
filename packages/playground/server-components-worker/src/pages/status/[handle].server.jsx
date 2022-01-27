import {TeapotError, BadRequestError, UnauthorizedError, ForbiddenError, NotFoundError} from '@shopify/hydrogen';

export async function api(request, {params: {handle}}) {
  switch (handle) {

    case '400':
      throw new BadRequestError('Bad request', 'Retry your request.');

    case '401':
      throw new UnauthorizedError('Unauthorized', 'Check your login details.');

    case '403':
      throw new ForbiddenError('Forbidden', 'Google uses this for Rate Limiting.');

    case '404':
      throw new NotFoundError('Not Found', 'This route was not found in the server.');

    case '418':
      throw new TeapotError('I\'m a Teapot', 'The requested entity body is short and stout.\n' +
          'Tip me over and pour me out.');
  }
}
