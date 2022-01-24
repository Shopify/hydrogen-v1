import {Env} from '../../../types';
import {Feature, ifFeature} from '../../../utilities/feature';
import addShopifyConfig from '../../add/shopifyConfig';
import addEslint from '../../add/eslint';
/**
 * Configure, modify and scaffold new `@shopify/hydrogen` apps.
 */
export async function app(env: Env<{name: string}>) {
  const {ui, fs, workspace, context} = env;
  const {name} = context || {};

  const features = await ui.ask<Feature>('Select the features you would like', {
    choices: [
      Feature.Pwa,
      Feature.Eslint,
      Feature.Stylelint,
      Feature.Tailwind,
      Feature.GraphQL,
      Feature.Prettier,
      Feature.CustomServer,
    ],
    name: 'features',
    multiple: true,
  });

  await addShopifyConfig(env);

  const templateArgs = {
    ifFeature: ifFeature(features),
    features,
    name,
  };

  await Promise.all([
    render('index.html', './templates/index-html'),
    render('vite.config.js', './templates/vite-config-js'),
    render('src/index.css', './templates/index-css'),
    render('src/App.server.jsx', './templates/App-server-jsx'),
    render('src/entry-client.jsx', './templates/entry-client-jsx'),
    render('src/entry-server.jsx', './templates/entry-server-jsx'),
    render('src/pages/Index.server.jsx', './templates/Index-server-jsx'),
    render('src/pages/About.server.jsx', './templates/About-server-jsx'),
    render('src/components/Link.client.jsx', './templates/Link-client-jsx'),
  ]);

  if (features.includes(Feature.CustomServer)) {
    await render('server.js', './templates/server-js');
    workspace.install('express');
  }

  if (features.includes(Feature.Stylelint)) {
    await render('.stylelintrc.js', './templates/stylelintrc-js');
    workspace.install('stylelint', {dev: true});
    workspace.install('@shopify/stylelint-plugin', {dev: true});
  }

  if (features.includes(Feature.Eslint)) {
    await addEslint(env);
  }

  if (features.includes(Feature.Tailwind)) {
    await render('tailwind.config.js', './templates/tailwind-config-js');
    await render('postcss.config.js', './templates/postcss-config-js');
    workspace.install('autoprefixer', {dev: true});
    workspace.install('postcss', {dev: true});
    workspace.install('tailwindcss', {dev: true});
    workspace.install('@tailwindcss/typography', {dev: true});
  }

  if (features.includes(Feature.Pwa)) {
    await render('public/sw.js', './templates/sw-js');
    workspace.install('vite-plugin-pwa', {version: '^0.8.1'});
  }

  if (features.includes(Feature.Prettier)) {
    await render('postcss.config.js', './templates/postcss-config-js');
    workspace.install('prettier');
    workspace.install('@shopify/prettier-config', {dev: true});
  }

  if (features.includes(Feature.GraphQL)) {
    workspace.install('graphql-tag');
  }

  workspace.install('react', {
    version: '0.0.0-experimental-529dc3ce8-20220124',
  });
  workspace.install('react-dom', {
    version: '0.0.0-experimental-529dc3ce8-20220124',
  });
  workspace.install('react-router-dom', {version: '^5.2.0'});
  workspace.install('@shopify/hydrogen');
  workspace.install('vite', {dev: true, version: '^2.7.0'});
  workspace.install('@vitejs/plugin-react-refresh', {
    dev: true,
    version: '^1.3.2',
  });

  async function render(path: string, templatePath: string) {
    fs.write(
      fs.join(workspace.root(), path),
      (await import(templatePath)).default(templateArgs)
    );
  }
}
