const onClick = () => window.alert('42');

export default function C2(props) {
  const color = props.myProp2 ? 'bg-blue-500' : 'bg-gray-500';
  return (
    <button
      className={`${color} text-white py-2 px-4 rounded`}
      onClick={onClick}
    >
      c-2
    </button>
  );
}
