---
gid: 946b8ee2-a32f-4146-9705-f1d1d91aa323
title: Shopify CLI for Hydrogen storefronts
description: Get familiar with the Shopify CLI requirements and commands for Hydrogen storefronts.
feature_flag: hydrogen2
---

> ⚠️ **Important:** [Hydrogen 2.0](https://hydrogen.shopify.dev) is out now. These archival docs are provided only to assist developers during their upgrade process. Please migrate to Hydrogen 2.0 as soon as possible.


Shopify CLI is a command-line interface tool that helps you build Hydrogen storefronts. You can also use it to automate many common development tasks.

You need to use Node.js to install Shopify CLI and manage its dependencies. However, you can use any technology stack to build your Hydrogen storefront's functionality.

This documentation explains how to use Shopify CLI for Hydrogen storefront development. To learn how to use Shopify CLI for other tasks, refer to the following documentation:

- [Shopify CLI for apps](/apps/tools/cli)
- [Shopify CLI for themes](/themes/tools/cli)

## Requirements

{% include /cli/prereqs.md %}

## Getting started

Shopify CLI is managed as a set of Node.js packages:

- [`@shopify/cli`](https://www.npmjs.com/package/@shopify/cli)
- [`@shopify/cli-hydrogen`](https://www.npmjs.com/package/@shopify/cli-hydrogen)

If you're building a Hydrogen storefront, then you don't need to install Shopify CLI globally. Instead, these packages should be added as dependencies of your app. Using Shopify CLI this way enables a consistent development experience across environments.

Because Shopify CLI requires a conventional directory structure, if you're creating a new Hydrogen storefront, then you should run one of the following commands to initialize your app:

{% codeblock terminal %}
```bash?title: 'npm'
npm init @shopify/hydrogen@latest
```

```bash?title: 'npx'
npx @shopify/create-hydrogen@latest
```

```bash?title: 'pnpm'
pnpm create @shopify/create-hydrogen@latest
```

```bash?title: 'Yarn'
yarn create @shopify/hydrogen
```
{% endcodeblock %}

> Tip:
> You can specify the [Hydrogen template](/custom-storefronts/hydrogen/getting-started/templates) that you want to use with the `--template` flag. You can specify a Hydrogen template, or pass a URL to a template hosted in GitHub.

Refer to the following tutorials for additional details about creating a Hydrogen storefront:

{% include custom-storefronts/hydrogen/tutorials.md %}

### Create a new Hydrogen storefront

You can create a new Hydrogen storefront using the [Hello World](/custom-storefronts/hydrogen/getting-started/templates#hello-world-template) or [Demo Store](/custom-storefronts/hydrogen/getting-started/templates#demo-store-template) template in either JavaScript or TypeScript.

{% codeblock terminal %}

```bash?title: 'npm'
npm init @shopify/hydrogen
```

```bash?title: 'npx'
npx @shopify/create-hydrogen
```

```bash?title: 'pnpm'
pnpm create @shopify/create-hydrogen
```

```bash?title: 'Yarn'
yarn create @shopify/hydrogen
```

{% endcodeblock %}

### Flags

| Flag | Description |
| --- | --- |
| `--template TEMPLATE` | `TEMPLATE` can be any of the following values: <br></br><ul><li><code>demo-store</code>: Scaffolds a Hydrogen storefront using the [Demo Store template](/custom-storefronts/hydrogen/getting-started/templates#demo-store-template). This is the default template. <br><strong>Aliases</strong>: <code>demo-store</code>, <code>"Demo store"</code>.</li><br></br><li><code>hello-world</code>: Scaffolds a Hydrogen storefront using the [Hello World template](/custom-storefronts/hydrogen/getting-started/templates#hello-world-template). <br><strong>Aliases</strong>:  <code>hello-world</code>, <code>"hello world"</code>, <code>"Hello-world"</code>, <code>"Hello world js"</code>, <code>Shopify/hydrogen/templates/hello-world</code>.</li><br></br><li><code>{user}/{repo}</code>: Scaffolds a Hydrogen storefront using a third-party template.<br><strong>Aliases</strong>: <code><https://github.com/{user}/{repo>}</code></li></ul> |
| `--ts` | Sets the template language to TypeScript. JavaScript is the default.|
| `--path` | Sets the absolute or relative path to your Hydrogen app directory. Defaults to the current directory. For example, `../path/to/folder`.|

## Command reference

Refer to the [Shopify CLI storefront command reference](/custom-storefronts/tools/cli/commands) to explore the commands available to build Hydrogen storefronts with Shopify CLI.

## Contributing to Shopify CLI

{% include /cli/contribute.md %}

## Where to get help

{% include /cli/get-help.md %}
