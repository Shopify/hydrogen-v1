import {Link} from '@shopify/hydrogen';

export default function Footer({collection, product}) {
  return (
    <footer role="contentinfo">
      <div className="relative bg-white border-t border-b border-black border-opacity-5">
        <div className="mx-auto max-w-7xl px-4 py-14 md:px-8 grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* eslint-disable-next-line @shopify/jsx-prefer-fragment-wrappers */}
          <div>
            <h2 className="text-md font-medium uppercase mb-4">Community</h2>
            <ul className="mt-8 space-y-4">
              <li className="text-sm font-medium text-gray-600 hover:text-gray-900">
                <a
                  href="https://github.com/Shopify/hydrogen/discussions"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center"
                >
                  <svg
                    aria-hidden="true"
                    className="fill-current text-gray-600 mr-3"
                    width="26"
                    height="20"
                    viewBox="0 0 21 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M10.1319 0.000976562C4.60874 0.000976562 0.135254 4.58917 0.135254 10.2539C0.135254 14.7908 2.99679 18.6229 6.97045 19.9814C7.47028 20.0711 7.65772 19.7635 7.65772 19.4944C7.65772 19.2509 7.64522 18.4434 7.64522 17.5848C5.13357 18.059 4.48379 16.9568 4.28385 16.38C4.17139 16.0853 3.68406 15.1753 3.2592 14.9318C2.90932 14.7396 2.40949 14.2654 3.2467 14.2526C4.03394 14.2397 4.59625 14.9959 4.78369 15.3035C5.68338 16.8542 7.1204 16.4185 7.6952 16.1494C7.78267 15.4829 8.04508 15.0343 8.33249 14.778C6.10824 14.5217 3.78402 13.6374 3.78402 9.71564C3.78402 8.60063 4.17139 7.67786 4.80868 6.96016C4.70871 6.70383 4.35883 5.65291 4.90864 4.24313C4.90864 4.24313 5.74586 3.97399 7.65772 5.29406C8.45745 5.06336 9.30716 4.94802 10.1569 4.94802C11.0066 4.94802 11.8563 5.06336 12.656 5.29406C14.5679 3.96117 15.4051 4.24313 15.4051 4.24313C15.9549 5.65291 15.605 6.70383 15.5051 6.96016C16.1424 7.67786 16.5297 8.58781 16.5297 9.71564C16.5297 13.6502 14.193 14.5217 11.9688 14.778C12.3311 15.0984 12.6435 15.7136 12.6435 16.6748C12.6435 18.0461 12.631 19.1483 12.631 19.4944C12.631 19.7635 12.8185 20.0839 13.3183 19.9814C15.3028 19.2943 17.0273 17.9861 18.2489 16.2411C19.4706 14.4962 20.128 12.4022 20.1285 10.2539C20.1285 4.58917 15.655 0.000976562 10.1319 0.000976562Z"
                    />
                  </svg>
                  Github discussions
                </a>
              </li>
              <li className="text-sm font-medium text-gray-600 hover:text-gray-900">
                <a
                  href="https://discord.gg/ppSbThrFaS"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center"
                >
                  <svg
                    aria-hidden="true"
                    className="fill-current text-gray-600 mr-3"
                    width="26"
                    height="20"
                    viewBox="0 0 26 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M21.3103 1.67597C19.691 0.893476 17.9595 0.324791 16.1494 0.000976562C15.9271 0.416095 15.6673 0.974439 15.4883 1.4186C13.564 1.11972 11.6574 1.11972 9.76855 1.4186C9.58952 0.974439 9.3239 0.416095 9.0996 0.000976562C7.28746 0.324791 5.55403 0.895566 3.93472 1.68012C0.668559 6.77767 -0.216844 11.7486 0.225859 16.649C2.39215 18.3198 4.49155 19.3348 6.55551 19.9989C7.06512 19.2745 7.51962 18.5045 7.91116 17.693C7.16546 17.4003 6.45123 17.0392 5.77638 16.6199C5.95541 16.4829 6.13054 16.3397 6.29973 16.1923C10.4159 18.1807 14.8882 18.1807 18.9551 16.1923C19.1263 16.3397 19.3014 16.4829 19.4785 16.6199C18.8016 17.0412 18.0855 17.4024 17.3398 17.6951C17.7313 18.5045 18.1838 19.2766 18.6954 20.001C20.7614 19.3368 22.8627 18.3219 25.029 16.649C25.5484 10.9682 24.1416 6.04292 21.3103 1.67597ZM8.47192 13.6353C7.2363 13.6353 6.22299 12.4439 6.22299 10.9931C6.22299 9.5423 7.21466 8.34886 8.47192 8.34886C9.72922 8.34886 10.7425 9.54021 10.7209 10.9931C10.7228 12.4439 9.72922 13.6353 8.47192 13.6353ZM16.7829 13.6353C15.5473 13.6353 14.534 12.4439 14.534 10.9931C14.534 9.5423 15.5256 8.34886 16.7829 8.34886C18.0402 8.34886 19.0535 9.54021 19.0319 10.9931C19.0319 12.4439 18.0402 13.6353 16.7829 13.6353Z" />
                  </svg>
                  Discord
                </a>
              </li>
            </ul>
          </div>
          {/* eslint-disable-next-line @shopify/jsx-prefer-fragment-wrappers */}
          <div>
            <h2 className="text-md font-medium uppercase mb-4">Templates</h2>
            <ul className="mt-8 space-y-4">
              <li className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900">
                <Link to="/home">Home</Link>
              </li>
              <li className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900">
                <Link to={`/products/${product?.handle}`}>Product</Link>
              </li>
              <li className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900">
                <Link to={`/collections/${collection?.handle}`}>
                  Collection
                </Link>
              </li>
            </ul>
          </div>
          {/* eslint-disable-next-line @shopify/jsx-prefer-fragment-wrappers */}
          <div>
            <h2 className="text-md font-medium uppercase mb-4">Docs</h2>
            <ul className="mt-8 space-y-4">
              <li className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900">
                <a href="https://shopify.dev/custom-storefronts/hydrogen">
                  Hydrogen overview
                </a>
              </li>
              <li className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900">
                <a href="https://shopify.dev/custom-storefronts/hydrogen/reference">
                  Hydrogen reference
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="py-6 px-4 md:px-8 bg-gray-50">
        <p className="text-gray-600">© 2021 Shopify</p>
      </div>
    </footer>
  );
}
