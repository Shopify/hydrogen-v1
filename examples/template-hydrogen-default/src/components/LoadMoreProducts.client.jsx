import {useServerState} from '@shopify/hydrogen/client';

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

function SpinnerIcon() {
  return (
    <svg
      width="54"
      height="54"
      viewBox="0 0 54 54"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="animate-spin"
    >
      <path
        d="M43.6663 27.0002C43.6663 36.2049 36.2044 43.6668 26.9997 43.6668C17.7949 43.6668 10.333 36.2049 10.333 27.0002C10.333 17.7954 17.7949 10.3335 26.9997 10.3335C36.2044 10.3335 43.6663 17.7954 43.6663 27.0002ZM13.6663 27.0002C13.6663 34.364 19.6359 40.3335 26.9997 40.3335C34.3635 40.3335 40.333 34.364 40.333 27.0002C40.333 19.6364 34.3635 13.6668 26.9997 13.6668C19.6359 13.6668 13.6663 19.6364 13.6663 27.0002Z"
        fill="#E6E7EB"
      />
      <path
        d="M26.9997 10.3332C29.1884 10.3332 31.3556 10.7643 33.3777 11.6018C35.3998 12.4394 37.2371 13.6671 38.7848 15.2147C40.3324 16.7624 41.5601 18.5997 42.3977 20.6218C43.2352 22.6439 43.6663 24.8111 43.6663 26.9998L40.333 26.9998C40.333 25.2489 39.9881 23.5151 39.3181 21.8974C38.648 20.2797 37.6659 18.8099 36.4278 17.5717C35.1896 16.3336 33.7198 15.3515 32.1021 14.6814C30.4844 14.0114 28.7506 13.6665 26.9997 13.6665L26.9997 10.3332Z"
        fill="black"
      />
    </svg>
  );
}
