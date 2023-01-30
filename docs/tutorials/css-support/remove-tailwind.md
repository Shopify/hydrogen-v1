---
gid: d4e863e6-c587-45d6-970e-31418bd5e597
title: Remove Tailwind
description: Learn how to remove Tailwind's library from Hydrogen if you want to write your own CSS.
---

If you don't want to build with Tailwind's library and instead want to write your own CSS, then you can remove Tailwind:

1. Delete all the code in `src/index.css`.
2. Remove Tailwind from `package.json`.
3. Remove Tailwind from `postcss.config.js`.
4. Run the following commands:

    {% codeblock terminal %}

    ```bash?filename: 'Terminal', title: 'npm'
    // Switch to your app's directory
    cd <directory>

    // Install dependencies
    npm i

    // Start the development server
    npm run dev
    ```

    ```bash?filename: 'Terminal', title: 'Yarn'
    // Switch to your app's directory
    cd <directory>

    // Install dependencies
    yarn

    // Start the development server
    yarn dev
    ```

    {% endcodeblock %}
