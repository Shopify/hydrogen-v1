import {useNavigate} from '@shopify/hydrogen/client';

export default function Logout() {
  const navigate = useNavigate();

  async function handleLogout() {
    const response = await callLogoutApi();

    if (response.error) {
      console.log('logout fail');
    } else {
      navigate('/');
    }
  }

  return (
    <div className="flex items-center justify-between">
      <button
        className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
        onClick={handleLogout}
      >
        Log out
      </button>
    </div>
  );
}

function callLogoutApi() {
  return fetch(`/account/api-logout`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })
    .then((res) => {
      if (res.status === 200) {
        return {};
      } else {
        return res.json();
      }
    })
    .catch((error) => {
      return {
        error: error.toString(),
      };
    });
}
