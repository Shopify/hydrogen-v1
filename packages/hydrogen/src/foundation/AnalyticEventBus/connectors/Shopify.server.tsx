import {log} from '../../../utilities/log';

export function request(request: Request): void {
  Promise.resolve(request.json())
    .then((data) => {
      if (data.eventname) {
        console.log(data.eventname, data.payload);
      }
    })
    .catch((error) => {
      log.warn('Fail to resolve server analytics: ', error);
    });
}
