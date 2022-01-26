import { TeapotError, RestError } from '@shopify/hydrogen/client'

export async function api(request, {params: {handle}}) {
  switch (handle) {
    case '418': {
      const error = new TeapotError('I\'m a teapot!', 'The requested entity body is short and stout. ' +
          'Tip me over and pour me out.')

      console.log('api error instanceof Error: ' + (error instanceof Error))
      console.log('api error instanceof RestError: ' + (error instanceof RestError))
      console.log('api error instanceof TeapotError: ' + (error instanceof TeapotError))

      throw error
    }
  }

}