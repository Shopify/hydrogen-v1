import {CacheLong, defineSection} from '@shopify/hydrogen';
import {Header as HeaderComponent} from '../components/global/Header.server';

export const Header = defineSection({
  section: 'Header',
  component: HeaderComponent,
  cache: CacheLong(),
});
