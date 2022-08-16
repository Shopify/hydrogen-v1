import {CacheLong, defineSection} from '@shopify/hydrogen';
import {Footer as FooterComponent} from '../components/global/Footer.server';

export const Footer = defineSection({
  section: 'Footer',
  component: FooterComponent,
  cache: CacheLong(),
});
