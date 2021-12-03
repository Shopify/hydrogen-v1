const onClick = () => window.alert('42');

export default function C2(props) {
  const color = props.myProp2 ? 'blue' : 'gray';
  return (
    <button
      className={`bg-${color}-500  text-white py-2 px-4 rounded`}
      onClick={onClick}
    >
      c-2
    </button>
  );
}
