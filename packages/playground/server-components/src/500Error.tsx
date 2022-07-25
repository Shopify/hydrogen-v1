export default function Error({error}: {error: Error}) {
  return (
    <div style={{textAlign: 'center'}}>
      <h1>
        <b>Custom Error Page</b>
      </h1>
      <h2>Message: {error.message}</h2>
      <h3>Stack: {error.stack}</h3>
    </div>
  );
}
