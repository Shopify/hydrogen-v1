const {loadEnv} = require('vite');

module.exports.loadProdEnv = function (cwd = __dirname) {
  const env = loadEnv('production', cwd, '');
  Object.keys(env).forEach((key) => {
    if (['VITE_', 'PUBLIC_'].some((prefix) => key.startsWith(prefix))) {
      delete env[key];
    }
  });

  return env;
};
