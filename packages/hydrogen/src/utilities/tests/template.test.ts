import {stripScriptsFromTemplate} from '../template';

describe('getScriptsFromTemplate', () => {
  it('identifies scripts and modules in a template', () => {
    const template = `<html><head>
      <script src="/foo.js"></script>
    </head>
    <body>
      <script src="/bar.js"></script>
      <script src="/module.js" type="module"></script>
    </body></html>`;

    const {noScriptTemplate, bootstrapScripts, bootstrapModules} =
      stripScriptsFromTemplate(template);

    expect(noScriptTemplate).not.toMatch('<script');

    expect(bootstrapScripts).toHaveLength(2);
    expect(bootstrapScripts[0]).toBe('/foo.js');

    expect(bootstrapModules).toHaveLength(1);
    expect(bootstrapModules[0]).toBe('/module.js');
  });

  it('identifies scripts and modules in a template even with script tag in head', () => {
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

    const {bootstrapScripts, bootstrapModules} =
      stripScriptsFromTemplate(template);

    expect(bootstrapScripts).toHaveLength(2);
    expect(bootstrapScripts[0]).toBe('/foo.js');

    expect(bootstrapModules).toHaveLength(1);
    expect(bootstrapModules[0]).toBe('/module.js');
  });

  it('identifies varying orders of attributes in script tags', () => {
    const template = `<html><body>
      <script type="module" src="/src/entry-client.tsx"></script>
    </body></html>`;

    const {noScriptTemplate, bootstrapScripts, bootstrapModules} =
      stripScriptsFromTemplate(template);

    expect(noScriptTemplate).not.toMatch('<script');
    expect(bootstrapScripts).toHaveLength(0);
    expect(bootstrapModules).toHaveLength(1);
    expect(bootstrapModules[0]).toBe('/src/entry-client.tsx');
  });

  it('does not crash if no script tags', () => {
    const template = `<html><body></body></html>`;

    const {noScriptTemplate, bootstrapScripts, bootstrapModules} =
      stripScriptsFromTemplate(template);

    expect(noScriptTemplate).not.toMatch('<script');
    expect(bootstrapScripts).toHaveLength(0);
    expect(bootstrapModules).toHaveLength(0);
  });

  it('identifies scripts with line breaks in them', () => {
    const template = `<html><head>
      <script src="/foo.js"></script>
    </head>
    <body>
      <script src="/bar.js"></script>
      <script src="/module.js"
              type="module"></script>
    </body></html>`;

    const {noScriptTemplate, bootstrapScripts, bootstrapModules} =
      stripScriptsFromTemplate(template);

    expect(noScriptTemplate).not.toMatch('<script');

    expect(bootstrapScripts).toHaveLength(2);
    expect(bootstrapScripts[0]).toBe('/foo.js');

    expect(bootstrapModules).toHaveLength(1);
    expect(bootstrapModules[0]).toBe('/module.js');
  });
});
