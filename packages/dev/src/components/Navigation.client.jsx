import {Link} from '@shopify/hydrogen/client';

export default function Navigation({collections}) {
  return (
    <nav className="hidden lg:block text-center">
      <ul className="md:flex items-center justify-center space-x-6 font-medium">
        {collections.map((collection) => (
          <li key={collection.id}>
            <Link
              to={`/collections/${collection.handle}`}
              className="block py-4 hover:opacity-80"
            >
              {collection.title}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
