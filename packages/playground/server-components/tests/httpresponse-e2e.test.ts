/* 2×× Success */
it('should return 200 status OK', async () => {
  const response = await page.request.get(viteTestUrl + '/status/200');

  expect(response.status()).toBe(200);
  expect(response.statusText()).toBe('OK');
});

it('should return 201 status Created', async () => {
  const response = await page.request.get(viteTestUrl + '/status/201');

  expect(response.status()).toBe(201);
  expect(response.statusText()).toBe('Created');
});

it('should return 202 status Accepted', async () => {
  const response = await page.request.get(viteTestUrl + '/status/202');

  expect(response.status()).toBe(202);
  expect(response.statusText()).toBe('Accepted');
});

it('should return 203 status Non-Authoritative Information', async () => {
  const response = await page.request.get(viteTestUrl + '/status/203');

  expect(response.status()).toBe(203);
  expect(response.statusText()).toBe('Non-Authoritative Information');
});

it('should return 204 status No Content', async () => {
  const response = await page.request.get(viteTestUrl + '/status/204');

  expect(response.status()).toBe(204);
  expect(response.statusText()).toBe('No Content');
});

it('should return 205 status Reset Content', async () => {
  const response = await page.request.get(viteTestUrl + '/status/205');

  expect(response.status()).toBe(205);
  expect(response.statusText()).toBe('Reset Content');
});

it('should return 206 status Partial Content', async () => {
  const response = await page.request.get(viteTestUrl + '/status/206');

  expect(response.status()).toBe(206);
  expect(response.statusText()).toBe('Partial Content');
});

it('should return 207 status Multi-Status', async () => {
  const response = await page.request.get(viteTestUrl + '/status/207');

  expect(response.status()).toBe(207);
  expect(response.statusText()).toBe('Multi-Status');
});

it('should return 208 status Already Reported', async () => {
  const response = await page.request.get(viteTestUrl + '/status/208');

  expect(response.status()).toBe(208);
  expect(response.statusText()).toBe('Already Reported');
});

it('should return 226 status IM Used', async () => {
  const response = await page.request.get(viteTestUrl + '/status/226');

  expect(response.status()).toBe(226);
  expect(response.statusText()).toBe('IM Used');
});

/* 3×× Redirection */
it('should return 300 status Multiple Choices', async () => {
  const response = await page.request.get(viteTestUrl + '/status/300');

  expect(response.status()).toBe(300);
  expect(response.statusText()).toBe('Multiple Choices');
});

it('should return 301 status Moved Permanently', async () => {
  const response = await page.request.get(viteTestUrl + '/status/301');

  expect(response.status()).toBe(301);
  expect(response.statusText()).toBe('Moved Permanently');
});

it('should return 302 status Found', async () => {
  const response = await page.request.get(viteTestUrl + '/status/302');

  expect(response.status()).toBe(302);
  expect(response.statusText()).toBe('Found');
});

it('should return 303 status See Other', async () => {
  const response = await page.request.get(viteTestUrl + '/status/303');

  expect(response.status()).toBe(303);
  expect(response.statusText()).toBe('See Other');
});

it('should return 304 status Not Modified', async () => {
  const response = await page.request.get(viteTestUrl + '/status/304');

  expect(response.status()).toBe(304);
  expect(response.statusText()).toBe('Not Modified');
});

it('should return 305 status Use Proxy', async () => {
  const response = await page.request.get(viteTestUrl + '/status/305');

  expect(response.status()).toBe(305);
  expect(response.statusText()).toBe('Use Proxy');
});

it('should return 307 status Temporary Redirect', async () => {
  const response = await page.request.get(viteTestUrl + '/status/307');

  expect(response.status()).toBe(307);
  expect(response.statusText()).toBe('Temporary Redirect');
});

it('should return 308 status Permanent Redirect', async () => {
  const response = await page.request.get(viteTestUrl + '/status/308');

  expect(response.status()).toBe(308);
  expect(response.statusText()).toBe('Permanent Redirect');
});

/* 4×× Client Error */
it('should return 400 status Bad Request', async () => {
  const response = await page.request.get(viteTestUrl + '/status/400');

  expect(response.status()).toBe(400);
  expect(response.statusText()).toBe('Bad Request');
});

it('should return 401 status Unauthorized', async () => {
  const response = await page.request.get(viteTestUrl + '/status/401');

  expect(response.status()).toBe(401);
  expect(response.statusText()).toBe('Unauthorized');
});

it('should return 402 status Payment Required', async () => {
  const response = await page.request.get(viteTestUrl + '/status/402');

  expect(response.status()).toBe(402);
  expect(response.statusText()).toBe('Payment Required');
});

it('should return 403 status Forbidden', async () => {
  const response = await page.request.get(viteTestUrl + '/status/403');

  expect(response.status()).toBe(403);
  expect(response.statusText()).toBe('Forbidden');
});

it('should return 404 status Not Found', async () => {
  const response = await page.request.get(viteTestUrl + '/status/404');

  expect(response.status()).toBe(404);
  expect(response.statusText()).toBe('Not Found');
});

it('should return 405 status Method Not Allowed', async () => {
  const response = await page.request.get(viteTestUrl + '/status/405');

  expect(response.status()).toBe(405);
  expect(response.statusText()).toBe('Method Not Allowed');
});

it('should return 406 status Not Acceptable', async () => {
  const response = await page.request.get(viteTestUrl + '/status/406');

  expect(response.status()).toBe(406);
  expect(response.statusText()).toBe('Not Acceptable');
});

it('should return 407 status Proxy Authentication Required', async () => {
  const response = await page.request.get(viteTestUrl + '/status/407');

  expect(response.status()).toBe(407);
  expect(response.statusText()).toBe('Proxy Authentication Required');
});

it('should return 408 status Request Timeout', async () => {
  const response = await page.request.get(viteTestUrl + '/status/408');

  expect(response.status()).toBe(408);
  expect(response.statusText()).toBe('Request Timeout');
});

it('should return 409 status Conflict', async () => {
  const response = await page.request.get(viteTestUrl + '/status/409');

  expect(response.status()).toBe(409);
  expect(response.statusText()).toBe('Conflict');
});

it('should return 410 status Gone', async () => {
  const response = await page.request.get(viteTestUrl + '/status/410');

  expect(response.status()).toBe(410);
  expect(response.statusText()).toBe('Gone');
});

it('should return 411 status Length Required', async () => {
  const response = await page.request.get(viteTestUrl + '/status/411');

  expect(response.status()).toBe(411);
  expect(response.statusText()).toBe('Length Required');
});

it('should return 412 status Precondition Failed', async () => {
  const response = await page.request.get(viteTestUrl + '/status/412');

  expect(response.status()).toBe(412);
  expect(response.statusText()).toBe('Precondition Failed');
});

it('should return 413 status Payload Too Large', async () => {
  const response = await page.request.get(viteTestUrl + '/status/413');

  expect(response.status()).toBe(413);
  expect(response.statusText()).toBe('Payload Too Large');
});

it('should return 414 status URI Too Long', async () => {
  const response = await page.request.get(viteTestUrl + '/status/414');

  expect(response.status()).toBe(414);
  expect(response.statusText()).toBe('URI Too Long');
});

it('should return 415 status Unsupported Media Type', async () => {
  const response = await page.request.get(viteTestUrl + '/status/415');

  expect(response.status()).toBe(415);
  expect(response.statusText()).toBe('Unsupported Media Type');
});

it('should return 416 status Requested Range not Satisfiable', async () => {
  const response = await page.request.get(viteTestUrl + '/status/416');

  expect(response.status()).toBe(416);
  expect(response.statusText()).toBe('Range Not Satisfiable');
});

it('should return 417 status Expectation Failed', async () => {
  const response = await page.request.get(viteTestUrl + '/status/417');

  expect(response.status()).toBe(417);
  expect(response.statusText()).toBe('Expectation Failed');
});

it("should return 418 status I'm a Teapot", async () => {
  const response = await page.request.get(viteTestUrl + '/status/418');

  expect(response.status()).toBe(418);
  expect(response.statusText()).toBe("I'm a Teapot");
});

it('should return 421 status Misdirected Request', async () => {
  const response = await page.request.get(viteTestUrl + '/status/421');

  expect(response.status()).toBe(421);
  expect(response.statusText()).toBe('Misdirected Request');
});

it('should return 422 status Unprocessable Entity', async () => {
  const response = await page.request.get(viteTestUrl + '/status/422');

  expect(response.status()).toBe(422);
  expect(response.statusText()).toBe('Unprocessable Entity');
});

it('should return 423 status Locked', async () => {
  const response = await page.request.get(viteTestUrl + '/status/423');

  expect(response.status()).toBe(423);
  expect(response.statusText()).toBe('Locked');
});

it('should return 424 status Failed Dependency', async () => {
  const response = await page.request.get(viteTestUrl + '/status/424');

  expect(response.status()).toBe(424);
  expect(response.statusText()).toBe('Failed Dependency');
});

it('should return 426 status Upgrade Required', async () => {
  const response = await page.request.get(viteTestUrl + '/status/426');

  expect(response.status()).toBe(426);
  expect(response.statusText()).toBe('Upgrade Required');
});

it('should return 428 status Precondition Required', async () => {
  const response = await page.request.get(viteTestUrl + '/status/428');

  expect(response.status()).toBe(428);
  expect(response.statusText()).toBe('Precondition Required');
});

it('should return 429 status Too Many Requests', async () => {
  const response = await page.request.get(viteTestUrl + '/status/429');

  expect(response.status()).toBe(429);
  expect(response.statusText()).toBe('Too Many Requests');
});

it('should return 431 status Request Header Fields Too Large', async () => {
  const response = await page.request.get(viteTestUrl + '/status/431');

  expect(response.status()).toBe(431);
  expect(response.statusText()).toBe('Request Header Fields Too Large');
});

it('should return 444 status Connection Closed Without Response', async () => {
  const response = await page.request.get(viteTestUrl + '/status/444');

  expect(response.status()).toBe(444);
  expect(response.statusText()).toBe('Connection Closed Without Response');
});

it('should return 451 status Unavailable For Legal Reasons', async () => {
  const response = await page.request.get(viteTestUrl + '/status/451');

  expect(response.status()).toBe(451);
  expect(response.statusText()).toBe('Unavailable For Legal Reasons');
});

// Currently not supported in NodeJS V16.13.2
/*it('should return 499 status Client Closed Request', async () => {
  const response = await page.request.get(viteTestUrl + '/status/499');

  expect(response.status()).toBe(499);
  expect(response.statusText()).toBe('Client Closed Request');
});*/

/* 5×× Server Error */
it('should return 500 status Internal Server Error', async () => {
  const response = await page.request.get(viteTestUrl + '/status/500');

  expect(response.status()).toBe(500);
  expect(response.statusText()).toBe('Internal Server Error');
});

it('should return 501 status Not Implemented', async () => {
  const response = await page.request.get(viteTestUrl + '/status/501');

  expect(response.status()).toBe(501);
  expect(response.statusText()).toBe('Not Implemented');
});

it('should return 502 status Bad Gateway', async () => {
  const response = await page.request.get(viteTestUrl + '/status/502');

  expect(response.status()).toBe(502);
  expect(response.statusText()).toBe('Bad Gateway');
});

it('should return 503 status Service Unavailable', async () => {
  const response = await page.request.get(viteTestUrl + '/status/503');

  expect(response.status()).toBe(503);
  expect(response.statusText()).toBe('Service Unavailable');
});

it('should return 504 status Gateway Timeout', async () => {
  const response = await page.request.get(viteTestUrl + '/status/504');

  expect(response.status()).toBe(504);
  expect(response.statusText()).toBe('Gateway Timeout');
});

it('should return 505 status HTTP Version Not Supported', async () => {
  const response = await page.request.get(viteTestUrl + '/status/505');

  expect(response.status()).toBe(505);
  expect(response.statusText()).toBe('HTTP Version Not Supported');
});

it('should return 506 status Variant Also Negotiates', async () => {
  const response = await page.request.get(viteTestUrl + '/status/506');

  expect(response.status()).toBe(506);
  expect(response.statusText()).toBe('Variant Also Negotiates');
});

it('should return 507 status Insufficient Storage', async () => {
  const response = await page.request.get(viteTestUrl + '/status/507');

  expect(response.status()).toBe(507);
  expect(response.statusText()).toBe('Insufficient Storage');
});

it('should return 508 status Loop Detected', async () => {
  const response = await page.request.get(viteTestUrl + '/status/508');

  expect(response.status()).toBe(508);
  expect(response.statusText()).toBe('Loop Detected');
});

it('should return 510 status Not Extended', async () => {
  const response = await page.request.get(viteTestUrl + '/status/510');

  expect(response.status()).toBe(510);
  expect(response.statusText()).toBe('Not Extended');
});

it('should return 511 status Network Authentication Required', async () => {
  const response = await page.request.get(viteTestUrl + '/status/511');

  expect(response.status()).toBe(511);
  expect(response.statusText()).toBe('Network Authentication Required');
});

// Currently not supported in NodeJS V16.13.2
/*it('should return 599 status Network Connect Timeout Error', async () => {
  const response = await page.request.get(viteTestUrl + '/status/599');

  expect(response.status()).toBe(599);
  expect(response.statusText()).toBe('Network Connect Timeout Error');
});*/
