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

  it('creates a link header from link tags in the document', async () => {
    const template = `<html><head>
      <link rel="stylesheet" href="/assets/1.css">
      <link rel="stylesheet" wrong="/assets/2.css">
      <!-- -->
      <link rel="preconnect" href="https://my-cdn.com">
      <script></script>
      <link rel="stylesheet" href="https://example.com/assets/3.css">
      <link rel="icon" href="/assets/4.css">
      <link rel="stylesheet" href="/assets/苗条.css">
      <link rel="preload" href="/myFont.woff2" as="font" type="font/woff2" crossorigin="anonymous">
    </head></html>`;

    const {linkHeader} = await getTemplate(template);
    expect(linkHeader).toEqual(
      [
        '</assets/1.css>; rel=preload; as=style',
        '<//my-cdn.com>; rel=preconnect',
        '<//example.com/assets/3.css>; rel=preload; as=style',
        '</assets/%E8%8B%97%E6%9D%A1.css>; rel=preload; as=style',
        '</myFont.woff2>; rel=preload; as=font; type=font/woff2; crossorigin=anonymous',
      ].join(', ')
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
