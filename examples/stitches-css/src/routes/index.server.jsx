import {styled} from '../../stitches.config';

const Heading = styled('h1', {
  backgroundColor: 'white',
  color: 'red',
  fontSize: '64px',
  padding: '0 15px',
  '&:hover': {
    backgroundColor: 'lightgray',
  },
  '@lg': {
    backgroundColor: 'red',
    color: 'white',
    '&:hover': {
      backgroundColor: 'darkred',
    },
  },
});

export default function Home() {
  return <Heading>Hello World</Heading>;
}
