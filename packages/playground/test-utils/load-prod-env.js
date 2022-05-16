const {loadEnv} = require('vite');

module.exports.loadProdEnv = async function (cwd = __dirname) {
  const env = await loadEnv('production', cwd, '');
  Object.keys(env).forEach((key) => {
    if (['VITE_', 'PUBLIC_'].some((prefix) => key.startsWith(prefix))) {
      delete env[key];
    }
  });

  return env;
};
