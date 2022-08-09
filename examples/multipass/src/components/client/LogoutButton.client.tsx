import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  onClick?: () => void;
}

export function LogoutButton(props: ButtonProps) {
  async function logout() {
    await fetch('/account/logout', {method: 'POST'});

    if (typeof props?.onClick === 'function') {
      props.onClick();
    }
    window.location.href = '/';
  }

  return (
    <button {...props} onClick={logout}>
      Logout
    </button>
  );
}
