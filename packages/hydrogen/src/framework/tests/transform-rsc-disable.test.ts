import {transformRscDisable, PREFIX} from '../plugins/vite-plugin-hydrogen-rsc';

describe('transformRscDisable', () => {
  it('transforms default imports and removes query', () => {
    expect(
      transformRscDisable(
        `//Before\nimport myValue from 'xyz?as:shared';\n//After`
      )
    ).toContain(`import ${PREFIX}myValue from 'xyz';`);
    expect(
      transformRscDisable(`import myValue from 'xyz?as:shared&something';`)
    ).toContain(`import ${PREFIX}myValue from 'xyz?something';`);
    expect(
      transformRscDisable(`import myValue from 'xyz?something&as:shared&more';`)
    ).toContain(`import ${PREFIX}myValue from 'xyz?something&more';`);
  });

  it('transforms named imports', () => {
    expect(
      transformRscDisable(
        `//Before\nimport {a1,b2} from 'xyz?as:shared';\n//After`
      )
    ).toContain(`import {a1 as ${PREFIX}a1,b2 as ${PREFIX}b2} from 'xyz';`);
  });

  it('transforms combined default and named imports', () => {
    expect(
      transformRscDisable(
        `//Before\nimport myValue, {a1,b2} from 'xyz?as:shared';\n//After`
      )
    ).toContain(
      `import ${PREFIX}myValue, {a1 as ${PREFIX}a1,b2 as ${PREFIX}b2} from 'xyz';`
    );
  });

  it('unwraps proxies in the original variable name', () => {
    expect(
      transformRscDisable(`import def, {a1} from 'xyz?as:shared';`)
    ).toContain(
      `const a1 = ${PREFIX}a1?.$$unwrappedValue ?? ${PREFIX}a1;const def = ${PREFIX}def?.$$unwrappedValue ?? ${PREFIX}def`
    );
  });
});
