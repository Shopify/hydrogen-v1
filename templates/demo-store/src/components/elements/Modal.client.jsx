import {useServerProps} from '@shopify/hydrogen';
import {useCallback} from 'react';

export default function Modal({children, editing}) {
  const {serverProps, setServerProps} = useServerProps();
  const close = useCallback(() => {
    setServerProps('editingAddress', null);
  }, [setServerProps]);

  return (
    <div
      className="relative z-50"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
      id="modal-bg"
      onClick={() => close()}
    >
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
      <div className="fixed z-50 inset-0 overflow-y-auto">
        <div className="flex items-center justify-center min-h-full p-4 text-center sm:p-0">
          <div
            className="relative bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-12 sm:max-w-sm sm:w-full sm:p-6"
            onClick={(e) => e.stopPropagation()}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
