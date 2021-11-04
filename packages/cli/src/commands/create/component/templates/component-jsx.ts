export default function ({name, path}: {name: string; path: string}) {
  return `
export function ${name}() {
  return (
    <div>${name} component at \`${path}\`</div>
  );
}
`;
}
