// @ts-check
// @ts-ignore
const {createServer} = require('./dist/server');
const {loadProdEnv} = require('./utils');

function createServerWithEnv() {
  return loadProdEnv().then((env) => {
    Object.assign(process.env, env);
    return createServer();
  });
}

if (require.main === module) {
  createServerWithEnv().then(({app}) => {
    const port = 8080;
    // @ts-ignore
    app.listen(port, () => {
      console.log(`Hydrogen running at http://localhost:${port}`);
    });
  });
}

// for test use
exports.createServer = createServerWithEnv;
