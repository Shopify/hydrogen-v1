const onClick = () => window.alert('42');

// NAMED EXPORT
export function C3(props) {
  const color = props.myProp3 ? 'blue' : 'gray';
  return (
    <button
      className={`bg-${color}-500  text-white py-2 px-4 rounded`}
      onClick={onClick}
    >
      c-3
    </button>
  );
}
