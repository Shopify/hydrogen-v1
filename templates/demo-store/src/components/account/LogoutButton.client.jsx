import {useCallback} from 'react';

export default function LogoutButton(props) {
  const logout = useCallback(() => {
    fetch('/account/logout', {method: 'POST'}).then(
      () => (window.location.href = '/'),
    );
  }, []);
  return (
    <button {...props} onClick={logout}>
      Logout
    </button>
  );
}
