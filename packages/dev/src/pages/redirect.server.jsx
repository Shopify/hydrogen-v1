export default function Redirect({response}) {
  response.redirect('/products/snowboard');
  return <div>This page is redirected</div>;
}
