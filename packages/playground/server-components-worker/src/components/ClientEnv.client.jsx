export default function Env() {
  let publicTest, privateTest;
  try {
    // This is replaced with a string at build time
    publicTest = Oxygen.env.HYDROGEN_PUBLIC_TEST;
    // This one crashes because Oxygen is not defined in browser
    privateTest = Oxygen.env.HYDROGEN_PRIVATE_TEST;
  } catch (error) {
    console.error(error);
  }

  return (
    <>
      <div>PUBLIC_VAR:{publicTest || ''}|</div>
      <div>PRIVATE_VAR:{privateTest || ''}|</div>
    </>
  );
}
