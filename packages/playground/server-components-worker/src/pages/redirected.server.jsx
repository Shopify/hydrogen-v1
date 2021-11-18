export default function Redirected({response}) {
  response.redirect('/about');

  return (
    <div>
      <h1>This page has been moved to /about</h1>
    </div>
  );
}
