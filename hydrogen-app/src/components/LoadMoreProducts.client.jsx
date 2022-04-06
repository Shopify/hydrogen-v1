import {useServerState} from '@shopify/hydrogen/client';
import SpinnerIcon from './SpinnerIcon.client';

/**
 * A client component that provides functionality to initially show a subset of products and a button to load more products
 */
export default function LoadMoreProducts({startingCount}) {
  const {pending, serverState, setServerState} = useServerState();

  return (
    <div className="flex justify-center h-14">
      {pending ? (
        <SpinnerIcon />
      ) : (
        <button
          type="button"
          disabled={pending}
          className={`uppercase border-4 bg-white border-black text-black text-center px-5 py-3 font-mono font-bold drop-shadow-lg active:drop-shadow-none hover:bg-black hover:text-white hover:border-white ${
            pending ? 'opacity-50' : undefined
          }`}
          onClick={() => {
            setServerState(
              'collectionProductCount',
              serverState.collectionProductCount
                ? serverState.collectionProductCount + 24
                : startingCount + 1,
            );
          }}
        >
          Load more
        </button>
      )}
    </div>
  );
}
