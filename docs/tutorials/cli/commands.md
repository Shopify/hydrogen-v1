---
gid: 06109cc9-3765-4d75-8df5-084bc88cfbef
title: Shopify CLI commands for Hydrogen storefronts
description: A reference of commands that you can use to build Hydrogen storefronts with Shopify CLI.
feature_flag: hydrogen2
---

> ⚠️ **Important:** [Hydrogen 2.0](https://hydrogen.shopify.dev) is out now. These archival docs are provided only to assist developers during their upgrade process. Please migrate to Hydrogen 2.0 as soon as possible.


This reference lists the commands that you can use to build Hydrogen storefronts with Shopify CLI.

## Command overview

| Command | Description |
| --- | --- |
| [add](#add) | Automatically installs and configures supported libraries, utilities, or packages. |
| [dev](#dev) | Runs a Hydrogen storefront locally for development. |
| [build](#build) | Builds a Hydrogen storefront for production. |
| [info](#info) | Prints configuration and diagnostic information about your Hydrogen storefront. |
| [preview](#preview) | Runs a Hydrogen storefront locally in a worker environment. |

## add

Automatically installs and configures supported libraries, utilities, or packages.

### eslint

Adds [ESLint](https://eslint.org/), [ESLint plugin Hydrogen configuration](/custom-storefronts/hydrogen/eslint#hydrogen-configuration), prettier, and prettier configuration to a Hydrogen project.

{% codeblock terminal %}

```bash
shopify hydrogen add eslint
```

{% endcodeblock %}

### tailwind

Installs [Tailwind](https://tailwindcss.com/) dependencies, configures Tailwind for the Hydrogen project, and adds Tailwind VSCode plugins.

{% codeblock terminal %}

```bash
shopify hydrogen add tailwind
```

{% endcodeblock %}

### Flags

| Flag | Description |
| --- | --- |
| `--force` | Overwrites existing configurations. |
| `--no-install` | Prevents the `add` command from running `yarn` and only updates the `package.json`. |
| `--path` | Sets the absolute or relative path to your Hydrogen app directory. Defaults to the current directory. For example, `../path/to/folder`. |

## dev

Runs a Hydrogen storefront locally for development.

{% codeblock terminal %}

```bash
shopify hydrogen dev
```

{% endcodeblock %}

### Flags

| Flag | Description |
| ---  | --- |
| `--force` | Forces dependencies to pre-bundle. |
| `--host` | Listens on all addresses, including LAN and public addresses. |
| `--verbose` | Provides more detailed output in the logs. |

## build

Builds a Hydrogen storefront for production.

{% codeblock terminal %}

```bash
shopify hydrogen build
```

{% endcodeblock %}

| Flag | Description |
| ---  | --- |
| `--target=<option>` | The platform to build your Hydrogen storefront on. Valid values: `node`, `worker`. The default is `worker`. |
| `--base=<value>` | The public path to your Hydrogen storefront in production. |
| `--[no-]client` | Builds the client code for your Hydrogen storefront. |
| `--entry=<value>` | Generates a build with server-side rendering (SSR) for node environments. |
| `--verbose` | Provides more detailed output in the logs. |

## info

Prints configuration and diagnostic information about your Hydrogen storefront.

{% codeblock terminal %}

```bash
shopify hydrogen info
```

{% endcodeblock %}

### Flags

| Flag | Description |
| ---  | --- |
| `--path` | Sets the absolute or relative path to your Hydrogen app directory. Defaults to the current directory. For example, `../path/to/folder`.|

## preview

Runs a Hydrogen storefront locally in a worker environment.

{% codeblock terminal %}

```bash
shopify hydrogen preview
```

{% endcodeblock %}

### Flags

| Flag | Description |
| ---  | --- |
| `--env` | Specifies an `.env` file to be used when creating the preview Hydrogen storefront on an [Oxygen environment](/custom-storefronts/oxygen). |
| `--target=<option>` | Sets the target environment (worker or node). Valid values: `node`, `worker`. The default is `worker`. |
| `--verbose` | Increases the verbosity of the logs. |
