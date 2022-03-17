export function request(request: Request, requestJSON?: any): void {
  if (requestJSON?.eventname) {
    console.log(requestJSON.eventname, requestJSON.payload);
  }
}
