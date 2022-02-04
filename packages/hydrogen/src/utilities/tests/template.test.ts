import {getScriptsFromTemplate} from '../template';

describe('getScriptsFromTemplate', () => {
  it('identifies scripts and modules in a template', () => {
    const template = `<html><body>
      <script src="/foo.js"></script>
      <script src="/bar.js"></script>
      <script src="/module.js" type="module"></script>
    </body></html>`;

    const {bootstrapScripts, bootstrapModules} =
      getScriptsFromTemplate(template);

    expect(bootstrapScripts).toHaveLength(2);
    expect(bootstrapScripts[0]).toBe('/foo.js');

    expect(bootstrapModules).toHaveLength(1);
    expect(bootstrapModules[0]).toBe('/module.js');
  });

  it('identifies varying orders of attributes in script tags', () => {
    const template = `<html><body>
      <script type="module" src="/src/entry-client.tsx"></script>
    </body></html>`;

    const {bootstrapScripts, bootstrapModules} =
      getScriptsFromTemplate(template);

    expect(bootstrapScripts).toHaveLength(0);
    expect(bootstrapModules).toHaveLength(1);
    expect(bootstrapModules[0]).toBe('/src/entry-client.tsx');
  });

  it('does not crash if no script tags', () => {
    const template = `<html><body></body></html>`;

    const {bootstrapScripts, bootstrapModules} =
      getScriptsFromTemplate(template);

    expect(bootstrapScripts).toHaveLength(0);
    expect(bootstrapModules).toHaveLength(0);
  });
});
