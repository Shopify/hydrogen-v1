export function request(
  request: Request,
  data?: any,
  contentType?: string
): void {
  if (contentType === 'json' && data?.eventname) {
    console.log(data.eventname, data.payload);
  }
}
