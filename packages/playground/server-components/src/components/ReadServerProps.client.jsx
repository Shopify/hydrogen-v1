import {useServerProps, Link} from '@shopify/hydrogen';

export default function ReadServerProps() {
  const {serverProps, setServerProps} = useServerProps();

  return (
    <div>
      <p
        id={
          Object.keys(serverProps).length
            ? 'server-props-with-data'
            : 'server-props'
        }
      >
        client: {JSON.stringify(serverProps)}
      </p>
      <button
        id="update-server-props"
        onClick={() => {
          setServerProps('message', {hello: 'world'});
        }}
      >
        Update server props
      </button>
      <Link id="navigate" to="/test-server-props?refresh">
        Navigate
      </Link>
    </div>
  );
}
