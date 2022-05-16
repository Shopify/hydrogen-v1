import ClientEnv from '../components/ClientEnv.client';

export default function Env() {
  return (
    <>
      <h1>Env</h1>

      <div className="secrets-server">
        <div>PUBLIC_VARIABLE:{import.meta.env.PUBLIC_VARIABLE || ''}|</div>
        <div>PRIVATE_VARIABLE:{Oxygen.env.PRIVATE_VARIABLE || ''}|</div>
      </div>

      <div className="secrets-client">
        <ClientEnv />
      </div>
    </>
  );
}
