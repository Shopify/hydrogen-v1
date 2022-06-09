import {useCallback} from 'react';

export function LogoutButton(props) {
  const logout = useCallback(() => {
    fetch('/account/logout', {method: 'POST'}).then(() => {
      props?.onClick();
      window.location.href = '/';
    });
  }, []);

  return (
    <button {...props} onClick={logout}>
      Logout
    </button>
  );
}

LogoutButton.displayName = 'LogoutButton';
