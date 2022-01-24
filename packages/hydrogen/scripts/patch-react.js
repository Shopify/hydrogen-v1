// This overwrites React files in `node_modules` until a new
// experimental version is released with the bug fixes.
// Called on "postinstall" script when installing Hydrogen.
console.log('Patching React experimental with latest bug fixes...');

const path = require('path');
const fs = require('fs');

const filesToPath = [
  'react-dom-server.node.development.js',
  'react-dom-server.browser.development.js',
  'react-dom-server.node.production.min.js',
  'react-dom-server.browser.production.min.js',
];
const reactDomServerPath = path.resolve(
  path.dirname(require.resolve('react-dom/server')),
  'cjs'
);

filesToPath.forEach((filename) => {
  const filepath = path.resolve(reactDomServerPath, filename);
  let code = fs.readFileSync(filepath, 'utf-8');

  // Remove comment to simplify the next regexp
  code = code.replace(
    "// On the way back, we push the new ones that weren't common.",
    ''
  );

  // Reorder statements like in https://github.com/facebook/react/pull/23171
  code = code.replace(
    /(same time\. This is a bug in React\..*?;\s*}?\s*[\w\s\(\),]+;\s*)([\w\(\).=]+;?)(\s*})/gms,
    function (_, m1, m2, m3) {
      return m1 + m3 + m2;
    }
  );

  fs.writeFileSync(filepath, code, 'utf-8');
});
