const https = require('https');
const http = require('http');

function checkHealth(url) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    const req = protocol.get(url, (res) => {
      if (res.statusCode >= 400) {
        reject(
          new Error(`${url} responded with status code ${res.statusCode}`)
        );
      }
      res.resume();
      console.log(`${url} is up!`);
      resolve(true);
    });
    req.on('error', (e) => {
      reject(e);
    });
  });
}

const url = process.argv[2];

checkHealth(url);
