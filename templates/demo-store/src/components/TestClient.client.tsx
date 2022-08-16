import React, {useState} from 'react';

const options = [
  'Test Client 1',
  'Test Client 2',
  'Test Client 3',
  'Test Client 4',
];

export function TestClient({defaultSelected}: {defaultSelected: string}) {
  const [selected, setSelected] = useState(defaultSelected);

  console.log('render TestClient:', selected, defaultSelected);

  return (
    <div className="border border-primary p-6" role="list">
      {options.map((option) => {
        const selectedHandler = () => {
          setSelected(option);
        };

        return (
          <button
            key={option}
            className={getStyle(option === selected)}
            onClick={selectedHandler}
            onKeyDown={selectedHandler}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}

function getStyle(isSelected: boolean) {
  return isSelected
    ? 'leading-none p-4 border-b-[1.5px] cursor-pointer transition-all duration-200 border-primary/50'
    : 'leading-none p-4 border-b-[1.5px] cursor-pointer transition-all duration-200 border-primary/0';
}
