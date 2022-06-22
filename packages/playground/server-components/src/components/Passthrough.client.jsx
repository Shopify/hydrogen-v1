export default function Passthrough({children, prop2}) {
  return (
    <>
      <div>{children}</div>
      <div dangerouslySetInnerHTML={{__html: prop2.escapedValue}} />
    </>
  );
}
