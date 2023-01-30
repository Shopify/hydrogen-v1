---
gid: 39996b9c-4da8-4b5e-99c5-169753f71d44
title: Getting started with Hydrogen
description: Learn about the different resources that are available to help you get started with Hydrogen.
---

Learn about the different resources that are available to help you get started with Hydrogen.

## Guides

Get started quickly or follow an end-to-end tutorial to learn how to build a Hydrogen storefront.

{% include custom-storefronts/hydrogen/tutorials.md %}

## Templates

Explore different templates that help you get started with Hydrogen.

{% include hydrogen/templates.md %}

## Examples

View Hydrogen examples that demonstrate integrations and special use cases.

{% include hydrogen/examples.md %}

## Reference

Consult the Hydrogen reference to learn about the available components, hooks, and utilities that help accelerate your development process.

{% unless feature_flags.hydrogen_ui%}

{% resource_card_container %}

{% resource_card type: :platform, link: "/api/hydrogen/components", title: "Components" %}
Get familiar with the components included in Hydrogen.
{% endresource_card %}

{% resource_card type: :build, link: "/api/hydrogen/hooks", title: "Hooks" %}
Get familiar with the hooks included in Hydrogen.
{% endresource_card %}

{% resource_card type: :utility, link: "/api/hydrogen/utilities", title: "Utilities" %}
Get familiar with the utilities included in Hydrogen.
{% endresource_card %}

{% endresource_card_container %}

{% else %}

{% resource_card_container %}

{% resource_card type: :library, link: "/api/hydrogen/framework", title: "Hydrogen framework" %}
Get familiar with the Hydrogen framework library reference.
{% endresource_card %}

{% resource_card type: :storefront, link: "/api/hydrogen/ui", title: "React Storefront Kit" %}
Get familiar with React Storefront Kit.
{% endresource_card %}

{% endresource_card_container %}

{% endunless %}

## Developer tools

Explore tools that help you accelerate your development process with Hydrogen.

{% unless feature_flags.hydrogen_ui %}

{% resource_card_container %}

{% resource_card type: :cli, link: "/custom-storefronts/tools/cli", title: "Shopify CLI" %}
Get familiar with Shopify CLI, a command-line interface tool that helps you build Hydrogen storefronts.
{% endresource_card %}

{% resource_card type: :github, link: "https://github.com/Shopify/hydrogen/", title: "Hydrogen GitHub repository" %}
Explore the open source Hydrogen repository on GitHub.
{% endresource_card %}

{% endresource_card_container %}

{% else %}

{% resource_card_container %}

{% resource_card type: :cli, link: "/custom-storefronts/tools/cli", title: "Shopify CLI" %}
Get familiar with Shopify CLI, a command-line interface tool that helps you build Hydrogen storefronts.
{% endresource_card %}

{% resource_card type: :github, link: "https://github.com/Shopify/hydrogen/", title: "Hydrogen GitHub repository" %}
Explore the open source repository for Hydrogen on GitHub.
{% endresource_card %}

{% resource_card type: :github, link: "https://github.com/Shopify/storefront-kit/", title: "React Storefront Kit GitHub repository" %}
Explore the open source repository for React Storefront Kit on GitHub.
{% endresource_card %}

{% endresource_card_container %}

{% endunless %}

## More resources

Consult additional resources to learn more about Hydrogen.

{% include hydrogen/more-resources.md %}

