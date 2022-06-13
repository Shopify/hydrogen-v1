export function LogoutButton(props) {
  const logout = () => {
    fetch('/account/logout', {method: 'POST'}).then(() => {
      if (typeof props?.onClick === 'function') {
        props.onClick();
      }
      window.location.href = '/';
    });
  };

  return (
    <button {...props} className="text-primary/50" onClick={logout}>
      Logout
    </button>
  );
}
