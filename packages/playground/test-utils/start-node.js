// @ts-check
const path = require('path');
// @ts-ignore
const {loadProdEnv} = require('./load-prod-env');

function createServerWithEnv({cwd = process.cwd()} = {}) {
  const {createServer} = require(path.join(cwd, 'dist', 'node'));

  return loadProdEnv(cwd).then((env) => {
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
