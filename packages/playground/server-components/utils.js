const {loadEnv} = require('vite');

module.exports.loadProdEnv = async function () {
  const env = await loadEnv('production', __dirname, '');
  Object.keys(env).forEach((key) => {
    if (['VITE_', 'PUBLIC_'].some((prefix) => key.startsWith(prefix))) {
      delete env[key];
    }
  });

  return env;
};
