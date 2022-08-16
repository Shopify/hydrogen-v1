import {defineSection} from '@shopify/hydrogen';

const Test = ({id}: {id: string}) => <p>Test RSC Outlet {id}</p>;

export const TestRSC = defineSection({
  section: 'TestRSC',
  component: Test,
  dependency: ['id'],
});
