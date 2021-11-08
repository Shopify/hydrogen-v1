export default function ({name, path}: {name: string; path: string}) {
  return `
export default function ${name}({request, response, ...serverState}) {
  return (
    <div>${name} component at \`${path}\`</div>
  );
}
`;
}
