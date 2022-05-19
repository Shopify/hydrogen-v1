import Passthrough from '../components/Passthrough.client';

export default function Escaping() {
  return (
    <Passthrough
      prop="</script><script>document.body = ''</script>"
      // eslint-disable-next-line react/no-children-prop
      children="</script><script>alert('hi')</script>"
    />
  );
}
