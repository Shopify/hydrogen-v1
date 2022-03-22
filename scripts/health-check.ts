import * as https from 'https';
import * as http from 'http';

function checkHealth(url: string) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    const req = protocol.get(url, (res) => {
      if (res.statusCode !== 200) {
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
