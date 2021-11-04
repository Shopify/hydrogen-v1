import React from 'react';

export default function ProductReview() {
  return (
    <div className="flex h-full items-center text-sm gap-x-px">
      {[1, 2, 3, 4, 5].map((item) => (
        <span
          key={item}
          className={item > 4 ? 'text-gray-400' : 'text-gray-900'}
        >
          ★
        </span>
      ))}
      <span className="text-gray-500 ml-2.5">10 Reviews</span>
    </div>
  );
}
