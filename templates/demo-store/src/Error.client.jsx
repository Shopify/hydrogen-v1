export default function Error({error}) {
  return (
    <h1>
      It broke {error.message} {error.stack}
    </h1>
  );
}
