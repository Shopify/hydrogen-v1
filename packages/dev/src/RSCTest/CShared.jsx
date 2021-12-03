import {C3} from './C3.client';

export default function CShared(props) {
  return (
    <div>
      c-shared
      <br></br>
      <C3 myProp3={props.myPropShared} />
    </div>
  );
}
