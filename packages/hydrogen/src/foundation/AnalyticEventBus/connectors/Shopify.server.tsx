export function request(request: Request) {
  Promise.resolve(request.json())
    .then((data) => {
      if (data.eventname) {
        console.log(data.eventname, data.payload);
      }
    })
    .catch((error) => {
      console.log('Fail to resolve server analytics: ', error);
    });
}
