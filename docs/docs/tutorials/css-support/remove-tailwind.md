# Remove Tailwind


:::tip
Hydrogen 2.0 is out now. These archival Hydrogen 1.0 docs are provided only to assist developers during their upgrade process. Please [migrate](/migrate) as soon as possible.
:::



If you don't want to build with Tailwind's library and instead want to write your own CSS, then you can remove Tailwind:

1. Delete all the code in `src/index.css`.
2. Remove Tailwind from `package.json`.
3. Remove Tailwind from `postcss.config.js`.
4. Run the following commands:


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


