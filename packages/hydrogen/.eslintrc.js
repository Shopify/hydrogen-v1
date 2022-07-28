module.exports = {
  extends: ['plugin:import/recommended', 'plugin:import/typescript'],
  rules: {
    // ensure that file extensions are used from now on
    'import/extensions': ['error', 'ignorePackages'],
    // next two are turned off because of the conflict between TS requiring .js extensions and those .js files not actually existing in the filesystem
    'import/no-unresolved': 'off',
    'node/no-missing-import': 'off',
  },
};
