import {Link, Image} from '@shopify/hydrogen';
import Section from './Section';

const mockLocations = [
  {
    id: '1',
    url: '/locations/toronto',
    image: 'https://picsum.photos/seed/31/912',
    title: '31 Crosby Street, NYC',
    subtitle: 'Open Now',
  },
  {
    id: '2',
    url: '/locations/toronto',
    image: 'https://picsum.photos/seed/41/912',
    title: '1-5-2 Aobadai, Meguro-Ku, Tokyo, Japan',
    subtitle: 'Opens at 11am',
  },
  {
    id: '3',
    url: '/locations/toronto',
    image: 'https://picsum.photos/seed/51/912',
    title: 'Shop 9, Albert Coates Lane, Melbourne',
    subtitle: 'Opens at 12am',
  },
];

// TODO: This should be consolidated with FeaturedCollections into a more generic presentational component

export default function Locations({
  title = 'Locations',
  locations = mockLocations,
}) {
  return (
    <Section heading={title}>
      <ul className="grid md:grid-cols-3 gap-m">
        {locations.map((location) => (
          <li key={location.id}>
            <Link to={location.url}>
              <div className="grid gap-m">
                <div className="">
                  <Image
                    className="rounded shadow-border overflow-clip inline-block aspect-square md:aspect-[4/3] object-fill"
                    width={'100%'}
                    height={336}
                    alt={`Image of ${location.title}`}
                    src={location.image}
                  />
                </div>
                <h3>{location.title}</h3>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </Section>
  );
}
