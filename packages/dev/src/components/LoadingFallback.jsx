import CartIcon from './CartIcon';
import OpenIcon from './OpenIcon';

export default function LoadingFallback() {
  return (
    <header className="h-20 lg:h-32 max-w-screen text-gray-700">
      <div className="fixed z-10 h-20 lg:h-32 w-full bg-white/90 border-b border-black border-opacity-5 px-6 md:px-8 md:py-6 lg:pt-8 lg:pb-0 mx-auto">
        <div className="h-full flex lg:flex-col place-content-between">
          <div className="text-center w-full flex justify-between items-center">
            <div className="hidden lg:block w-16" />
            <div className="lg:hidden flex justify-center items-center w-7 h-full">
              <OpenIcon />
            </div>
            <p className="font-black uppercase text-3xl tracking-widest">
              Snowdevil
            </p>
            <CartIcon />
          </div>
        </div>
      </div>
    </header>
  );
}
