import {Fragment, useState} from 'react';
import {Dialog, Transition} from '@headlessui/react';

import {IconClose} from '~/components';

/**
 * Drawer component that opens on user click.
 * @param open - boolean state. if true opens the drawer.
 * @param onClose - function should set the open state.
 * @param children - react children node.
 */
function Drawer({open, onClose, children}) {
  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 left-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0">
          <div className="absolute inset-0 overflow-hidden">
            <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="w-[35rem] transform bg-contrast text-left align-middle shadow-xl transition-all">
                  <div className="absolute top-0 right-0 -ml-8 flex md:pt-8 md:pr-12 pt-6 pr-4">
                    <button
                      type="button"
                      className="rounded-md text-primary hover:text-primary"
                      onClick={onClose}
                    >
                      <IconClose className="h-6 w-6" area-label="Close panel" />
                    </button>
                  </div>
                  {children}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

/* Use for associating arialabelledby with the title*/
Drawer.Title = Dialog.Title;

export {Drawer};

export function useDrawer(openDefault = false) {
  const [isOpen, setIsOpen] = useState(openDefault);

  function openDrawer() {
    setIsOpen(true);
  }

  function closeDrawer() {
    setIsOpen(false);
  }

  return {
    isOpen,
    openDrawer,
    closeDrawer,
  };
}
