// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Hydrogen v1',
  tagline: 'Archived documentation for Hydrogen 1',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://shopify.github.io/',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/hydrogen-v1/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'shopify', // Usually your GitHub org/user name.
  projectName: 'hydrogen-v1', // Usually your repo name.

  // https://docusaurus.io/docs/deployment#deploying-to-github-pages
  deploymentBranch: 'gh-pages',
  trailingSlash: false,

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          routeBasePath: '/',
          sidebarPath: require.resolve('./sidebars.js'),
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: 'Hydrogen v1',
        items: [
          {
            type: 'doc',
            docId: 'index',
            position: 'left',
            label: 'Overview',
          },
          {
            type: 'doc',
            docId: 'tutorials',
            position: 'left',
            label: 'Tutorials',
          },
          {
            type: 'doc',
            docId: 'api',
            position: 'left',
            label: 'API reference',
          },
          {
            href: 'migrate',
            label: 'Migrate to Hydrogen 2',
            position: 'left',
          },
          {
            href: 'https://github.com/shopify/hydrogen-v1',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Links',
            items: [
              {
                label: 'Shopify.dev',
                href: 'https://shopify.dev',
              },
              {
                label: '@shopifydevs',
                href: 'https://twitter.com/shopifydevs',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'Hydrogen 2',
                to: 'https://shopify.dev/docs/storefronts/headless/hydrogen',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Shopify.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
      docs: {
        sidebar: {
          autoCollapseCategories: true
        }
      },
      algolia: {
        appId: 'G3N23JDU81',
        apiKey: 'fd4ebf5b6925a67f3e21d78c89977d97',
        indexName: 'hydrogen-v1',
      },
    }),
};

module.exports = config;
