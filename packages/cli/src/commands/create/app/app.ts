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
    choices: [Feature.TypeScript, Feature.Tailwind],
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
    render('src/routes/Index.server.jsx', './templates/Index-server-jsx'),
    render('src/routes/About.server.jsx', './templates/About-server-jsx'),
    render(
      'src/components/Welcome.server.jsx',
      './templates/Welcome-server-jsx'
    ),
    render('src/components/Loading.jsx', './templates/Loading-jsx'),
    render(
      'src/components/NotFound.server.jsx',
      './templates/NotFound-server-jsx'
    ),
  ]);

  await render('.stylelintrc.js', './templates/stylelintrc-js');
  workspace.install('stylelint', {dev: true, version: '^13.13.0'});
  workspace.install('@shopify/stylelint-plugin', {
    dev: true,
    version: '^10.0.1',
  });

  await addEslint(env);

  if (features.includes(Feature.Tailwind)) {
    await render('tailwind.config.js', './templates/tailwind-config-js');
    await render('postcss.config.js', './templates/postcss-config-js');
    workspace.install('autoprefixer', {dev: true, version: '^10.4.1'});
    workspace.install('postcss', {dev: true, version: '^8.4.5'});
    workspace.install('tailwindcss', {dev: true, version: '^3.0.0'});
    workspace.install('@tailwindcss/typography', {
      dev: true,
      version: '^0.5.0',
    });
    await render('postcss.config.js', './templates/postcss-config-js');
  }

  workspace.install('prettier', {dev: true, version: '^2.3.2'});
  workspace.install('@shopify/prettier-config', {dev: true, version: '^1.1.2'});

  workspace.install('graphql-tag', {version: '^2.12.4'});

  workspace.install('react', {
    version: '0.0.0-experimental-529dc3ce8-20220124',
  });
  workspace.install('react-dom', {
    version: '0.0.0-experimental-529dc3ce8-20220124',
  });
  workspace.install('@shopify/hydrogen', {version: '^0.9.1'});
  workspace.install('@shopify/hydrogen-cli', {version: '^0.9.1'});
  workspace.install('vite', {dev: true, version: '^2.7.1'});

  await workspace.commit();

  async function render(path: string, templatePath: string) {
    fs.write(
      fs.join(workspace.root(), path),
      (await import(templatePath)).default(templateArgs)
    );
  }
}
