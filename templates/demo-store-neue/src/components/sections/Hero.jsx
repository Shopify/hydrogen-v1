import {Image, Link} from '@shopify/hydrogen';
import {Heading, Text} from '../elements';

const placeholder = {
  title: 'All-Weather,\nAll-Season…',
  subtitle: 'The Mason Horse Bit Loafer // Vibram 1757',
  images: [
    'https://picsum.photos/seed/1/1480',
    'https://picsum.photos/seed/2/1480',
  ],
  cta: {
    label: 'Shop Now →',
    url: '/redirect',
  },
};

export default function Hero({
  title = placeholder.title,
  subtitle = placeholder.subtitle,
  images = placeholder.images,
  cta = placeholder.cta,
  height,
  top,
}) {
  return (
    <Link to={cta.url}>
      <section
        className={`relative justify-end flex flex-col w-full ${
          top && '-mt-nav'
        } ${height === 'full' ? 'h-screen' : 'h-[50rem]'}`}
      >
        <div className="absolute inset-0 grid flex-grow grid-flow-col pointer-events-none -z-10 content-stretch overflow-clip">
          {images.map((image, i) => (
            <Image
              key={i}
              width={1480}
              height={1480}
              alt={`Image of ${title}`}
              className="block object-cover w-auto h-full"
              src={image}
            />
          ))}
        </div>
        <div className="flex flex-col items-baseline justify-between gap-4 px-12 py-8 bg-gradient-to-t from-primary/60 text-contrast">
          <Heading
            format={false}
            as="h2"
            size="display"
            className="max-w-prose-narrow"
          >
            {title}
          </Heading>
          <Text color="contrast" as="p" size="lead">
            {subtitle}
          </Text>
          <Link to={cta.url}>
            <Text color="contrast" size="lead">
              {cta.label}
            </Text>
          </Link>
        </div>
      </section>
    </Link>
  );
}
