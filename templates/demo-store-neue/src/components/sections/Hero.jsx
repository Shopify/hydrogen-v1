import {Image, Video, Link} from '@shopify/hydrogen';

import {Heading, Text} from '~/components';
import {hero as mockData} from '~/lib/placeholders';

export function Hero(props = mockData) {
  const {
    title,
    byline,
    cta,
    handle,
    spread,
    spreadSecondary,
    height,
    top,
    loading,
  } = props;

  return (
    <Link to={`/collections/${handle}`}>
      <section
        className={`relative justify-end flex flex-col w-full ${
          top && '-mt-nav'
        } ${
          height === 'full'
            ? 'h-screen'
            : 'aspect-[4/5] sm:aspect-square md:aspect-[5/4] lg:aspect-[3/2] xl:aspect-[2/1]'
        }`}
      >
        <div className="absolute inset-0 grid flex-grow grid-flow-col pointer-events-none auto-cols-fr -z-10 content-stretch overflow-clip">
          {spread?.reference && (
            <div className="">
              <SpreadMedia data={spread.reference} loading={loading} />
            </div>
          )}
          {spreadSecondary?.reference && (
            <div className="hidden md:block">
              <SpreadMedia data={spreadSecondary.reference} />
            </div>
          )}
        </div>
        <div className="flex flex-col items-baseline justify-between gap-4 px-6 py-8 sm:px-8 md:px-12 bg-gradient-to-t dark:from-contrast/60 dark:text-primary from-primary/60 text-contrast">
          <Heading as="h2" size="display" format className="max-w-md">
            {title.value}
          </Heading>
          {byline && (
            <Text format width="narrow" as="p" size="lead">
              {byline.value}
            </Text>
          )}
          <Text size="lead">{cta.value}</Text>
        </div>
      </section>
    </Link>
  );
}

function SpreadMedia({data, loading}) {
  if (data.mediaContentType === 'VIDEO') {
    return (
      <Video
        width={1200}
        height={1600}
        alt={data.alt || 'Marketing Banner Video'}
        className="block object-cover w-full h-full"
        data={data}
        controls={false}
        muted
        loop
        playsInline
        autoPlay
      />
    );
  }

  if (data.mediaContentType === 'IMAGE') {
    return (
      <Image
        width={1200}
        height={1600}
        alt={data.alt || 'Marketing Banner Image'}
        className="block object-cover w-full h-full"
        data={data.image}
        loading={loading}
      />
    );
  }

  return null;
}
