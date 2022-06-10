const Components = {
  foo: [<p key="foo">Hello</p>],
};

export function Hello() {
  return Components.foo[0];
}
