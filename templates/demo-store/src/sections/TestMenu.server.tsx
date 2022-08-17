import {defineSection, Link} from '@shopify/hydrogen';

const Menu = () => {
  return (
    <div className="border p-6 mb-4">
      <nav className="flex gap-12">
        <Link to="/test">Overview</Link>
        <Link to="/test/subnav1">Error from GQL</Link>
        <Link to="/test/subnav2">Error from page</Link>
        <Link to="/test/subnav3">Error from page with fallback</Link>
        <Link to="/test/subnav4">All errors in a route</Link>
      </nav>
    </div>
  );
};

export const TestMenu = defineSection({
  section: 'TestMenu',
  component: Menu,
});
