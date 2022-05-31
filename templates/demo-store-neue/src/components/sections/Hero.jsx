import {Image, Link} from '@shopify/hydrogen';
import {Heading, Text} from '../elements';
import {hero as mockData} from '~/lib/placeholders';

export default function Hero({data = mockData, height, top}) {
  const {title, byline, cta, url, spread, spread_secondary, text_color} = data;

  return (
    <Link to={url.value}>
      <section
        className={`relative justify-end flex flex-col w-full ${top &&
          '-mt-nav'} ${height === 'full' ? 'h-screen' : 'h-[50rem]'}`}
      >
        <div className="absolute inset-0 grid flex-grow grid-flow-col pointer-events-none -z-10 content-stretch overflow-clip">
          {/* {images.map((image, i) => (
            <Image
              key={i}
              width={1480}
              height={1480}
              alt={`Image of ${title}`}
              className="block object-cover w-auto h-full"
              src={image}
            />
          ))} */}
          {spread.value && <></>}
          {spread_secondary.value && <></>}
        </div>
        <div className="flex flex-col items-baseline justify-between gap-4 px-12 py-8 bg-gradient-to-t from-primary/60 text-contrast">
          <Heading as="h2" size="display" className="max-w-prose-narrow">
            {title.value}
          </Heading>
          <Text color="contrast" as="p" size="lead">
            {byline.value}
          </Text>
          <Link to={cta.url}>
            <Text color="contrast" size="lead">
              {cta.value}
            </Text>
          </Link>
        </div>
      </section>
    </Link>
  );
}
