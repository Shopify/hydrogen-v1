export default function Env() {
  let publicVariable, privateVariable;
  try {
    // This is replaced with a string at build time
    publicVariable = import.meta.env.PUBLIC_VARIABLE;
    // This one crashes because Oxygen is not defined in browser
    privateVariable = Oxygen.env.PRIVATE_VARIABLE;
  } catch (error) {}

  return (
    <>
      <div>PUBLIC_VARIABLE:{publicVariable || ''}|</div>
      <div>PRIVATE_VARIABLE:{privateVariable || ''}|</div>
    </>
  );
}
