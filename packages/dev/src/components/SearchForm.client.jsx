import {useState} from 'react';
import {useServerState} from '@shopify/hydrogen/client';
import {useHistory} from 'react-router-dom';

export default function Search({query}) {
  const [newQuery, setNewQuery] = useState(query);
  const {pending, setServerState} = useServerState('query', query);
  const history = useHistory();

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        history.push(`/search?query=${newQuery}`);
        setServerState('query', newQuery);
      }}
      className={`mt-4 space-x-2 ${pending ? 'opacity-50' : undefined}`}
    >
      <label htmlFor="search">Search Products:</label>
      <input
        autoComplete="off"
        name="search"
        id="search"
        type="search"
        value={newQuery}
        onChange={(event) => setNewQuery(event.target.value)}
        className="px-2 py-1 placeholder-gray-400 text-gray-600 relative bg-white bg-white rounded text-sm border border-gray-400 outline-none focus:outline-none focus:ring"
      />
      <button
        type="submit"
        className="bg-black text-white font-bold p-1"
        disabled={pending}
      >
        Search
      </button>
    </form>
  );
}
