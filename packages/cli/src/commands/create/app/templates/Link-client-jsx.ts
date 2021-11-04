export default function () {
  return `
import {Link as ReactRouterLink} from 'react-router-dom';

export default function Link(props) {
  return (
    <ReactRouterLink {...props} />
  );
}
`;
}
