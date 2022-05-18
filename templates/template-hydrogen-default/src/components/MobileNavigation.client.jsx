import {Fragment, useEffect} from 'react';
import {Link} from '@shopify/hydrogen';
import {FocusTrap} from '@headlessui/react';

import MobileCountrySelector from './MobileCountrySelector.client';
import OpenIcon from './OpenIcon';

let scrollPosition = 0;

/**
 * A client component that defines the navigation for a mobile storefront
 */
export default function MobileNavigation({collections, isOpen, setIsOpen}) {
  const OpenFocusTrap = isOpen ? FocusTrap : Fragment;

  useEffect(() => {
    if (isOpen) {
      scrollPosition = window.scrollY;
      document.body.style.position = 'fixed';
    } else if (document.body.style.position) {
      document.body.style.position = '';
      window.scrollTo(0, scrollPosition);
    }
  }, [isOpen]);

  return (
    <div className="lg:hidden">
      <OpenFocusTrap>
        <button
          type="button"
          className="flex justify-center items-center w-7 h-full"
          onClick={() => setIsOpen((previousIsOpen) => !previousIsOpen)}
        >
          <span className="sr-only">{isOpen ? 'Close' : 'Open'} Menu</span>
          {isOpen ? <CloseIcon /> : <OpenIcon />}
        </button>
        {isOpen ? (
          <div className="fixed -left-0 top-20 w-full h-screen z-10 bg-gray-50 px-4 md:px-12 py-7">
            <ul>
              {collections.map((collection) => (
                <li className="border-b border-gray-200" key={collection.id}>
                  <Link
                    className="group py-5 text-gray-700 flex items-center justify-between"
                    to={`/collections/${collection.handle}`}
                    onClick={() => setIsOpen(false)}
                  >
                    {collection.title}
                    <ArrowRightIcon className="hidden group-hover:block" />
                  </Link>
                </li>
              ))}
            </ul>
            <MobileCountrySelector />
          </div>
        ) : null}
      </OpenFocusTrap>
    </div>
  );
}

function CloseIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1 17L17 1M1 1L17 17"
        stroke="black"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArrowRightIcon({className}) {
  return (
    <svg
      className={className}
      width="7"
      height="12"
      viewBox="0 0 7 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0.999762 12C0.743762 12 0.487762 11.902 0.292762 11.707C-0.0982383 11.316 -0.0982383 10.684 0.292762 10.293L4.58576 6.00001L0.292762 1.70701C-0.0982383 1.31601 -0.0982383 0.684006 0.292762 0.293006C0.683762 -0.0979941 1.31576 -0.0979941 1.70676 0.293006L6.70676 5.29301C7.09776 5.68401 7.09776 6.31601 6.70676 6.70701L1.70676 11.707C1.51176 11.902 1.25576 12 0.999762 12Z"
        fill="black"
      />
    </svg>
  );
}
