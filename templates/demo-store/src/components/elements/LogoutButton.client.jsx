import {useCallback} from 'react';
import Text from './Text';

export default function LogoutButton(props) {
  const logout = useCallback(() => {
    fetch('/account/logout', {method: 'POST'}).then(
      () => (window.location.href = '/'),
    );
  }, []);
  return (
    <button {...props} onClick={logout}>
      <Text className="font-normal text-base text-gray-400" size="copy">
        Sign out
      </Text>
    </button>
  );
}
