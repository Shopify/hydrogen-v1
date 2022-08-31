import {getTemplate} from '../template.js';

describe('getTemplate', () => {
  it('identifies scripts and modules in a template', async () => {
    const template = `<html><head>
      <script src="/foo.js"></script>
    </head>
    <body>
      <script src="/bar.js"></script>
      <script src="/module.js" type="module"></script>
    </body></html>`;

    const {noScriptTemplate, bootstrapScripts, bootstrapModules} =
      await getTemplate(template);

    expect(noScriptTemplate).not.toMatch('<script');

    expect(bootstrapScripts).toHaveLength(2);
    expect(bootstrapScripts[0]).toBe('/foo.js');

    expect(bootstrapModules).toHaveLength(1);
    expect(bootstrapModules[0]).toBe('/module.js');
  });

  it('identifies scripts and modules in a template even with script tag in head', async () => {
    const template = `<html><head>
      <script type="module">
        var foo = 'bar';
      </script>
      <script src="/foo.js"></script>
    </head>
    <body>
      <script src="/bar.js"></script>
      <script src="/module.js" type="module"></script>
    </body></html>`;

    const {bootstrapScripts, bootstrapModules} = await getTemplate(template);

    expect(bootstrapScripts).toHaveLength(2);
    expect(bootstrapScripts[0]).toBe('/foo.js');

    expect(bootstrapModules).toHaveLength(1);
    expect(bootstrapModules[0]).toBe('/module.js');
  });

  it('identifies varying orders of attributes in script tags', async () => {
    const template = `<html><body>
      <script type="module" src="/src/entry-client.tsx"></script>
    </body></html>`;

    const {noScriptTemplate, bootstrapScripts, bootstrapModules} =
      await getTemplate(template);

    expect(noScriptTemplate).not.toMatch('<script');
    expect(bootstrapScripts).toHaveLength(0);
    expect(bootstrapModules).toHaveLength(1);
    expect(bootstrapModules[0]).toBe('/src/entry-client.tsx');
  });

  it('does not crash if no script tags', async () => {
    const template = `<html><body></body></html>`;

    const {noScriptTemplate, bootstrapScripts, bootstrapModules} =
      await getTemplate(template);

    expect(noScriptTemplate).not.toMatch('<script');
    expect(bootstrapScripts).toHaveLength(0);
    expect(bootstrapModules).toHaveLength(0);
  });

  it('identifies scripts with line breaks in them', async () => {
    const template = `<html><head>
      <script src="/foo.js"></script>
    </head>
    <body>
      <script src="/bar.js"></script>
      <script src="/module.js"
              type="module"></script>
    </body></html>`;

    const {noScriptTemplate, bootstrapScripts, bootstrapModules} =
      await getTemplate(template);

    expect(noScriptTemplate).not.toMatch('<script');

    expect(bootstrapScripts).toHaveLength(2);
    expect(bootstrapScripts[0]).toBe('/foo.js');

    expect(bootstrapModules).toHaveLength(1);
    expect(bootstrapModules[0]).toBe('/module.js');
  });

  it('finds and encodes the stylesheets in a document', async () => {
    const template = `<html><head>
      <link rel="stylesheet" href="/assets/1.css">
      <link rel="stylesheet" wrong="/assets/2.css">
      <!-- -->
      <link rel="preconnect" href="/assets/3.css">
      <script></script>
      <link rel="stylesheet" href="https://example.com/assets/4.css">
      <link rel="stylesheet" href="/assets/苗条.css">
    </head></html>`;

    const {stylesheets} = await getTemplate(template);

    expect(stylesheets).toHaveLength(3);
    expect(stylesheets).toEqual(
      expect.arrayContaining([
        '/assets/1.css',
        '//example.com/assets/4.css',
        '/assets/%E8%8B%97%E6%9D%A1.css',
      ])
    );
  });

  it('accepts a function', async () => {
    const {raw} = await getTemplate(
      (url) => Promise.resolve('my-template:' + url),
      new URL('https://example.com/')
    );

    expect(raw).toEqual('my-template:https://example.com/');
  });
});
