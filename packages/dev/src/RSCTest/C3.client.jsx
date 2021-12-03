const onClick = () => window.alert('42');

// NAMED EXPORT
export function C3(props) {
  const color = props.myProp3 ? 'bg-blue-500' : 'bg-gray-500';
  return (
    <button
      className={`${color}  text-white py-2 px-4 rounded`}
      onClick={onClick}
    >
      c-3
    </button>
  );
}
