export default function Redirect({response}) {
  response.redirect('/');

  return (
    <div>
      <h1>This page has been moved to /</h1>
    </div>
  );
}
