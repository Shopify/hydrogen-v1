import React from 'react';
import {Image, Link, Video} from '@shopify/hydrogen';
import type {Media} from '@shopify/hydrogen/storefront-api-types';

import {Heading, Text} from '~/components';
import {hero as mockData} from '~/lib/placeholders';

type HeroProps = typeof mockData &
  Partial<{
    handle: string;
    spread: any;
    spreadSecondary: any;
    height: 'full';
    top: number;
    loading: SpreadMediaProps['loading'];
  }>;

export function Hero(props: HeroProps = mockData) {
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
              <SpreadMedia
                scale={2}
                sizes={
                  spreadSecondary?.reference
                    ? '(min-width: 80em) 700, (min-width: 48em) 450, 500'
                    : '(min-width: 80em) 1400, (min-width: 48em) 900, 500'
                }
                widths={
                  spreadSecondary?.reference
                    ? [500, 450, 700]
                    : [500, 900, 1400]
                }
                width={spreadSecondary?.reference ? 375 : 750}
                data={spread.reference}
                loading={loading}
              />
            </div>
          )}
          {spreadSecondary?.reference && (
            <div className="hidden md:block">
              <SpreadMedia
                sizes="(min-width: 80em) 700, (min-width: 48em) 450, 500"
                widths={[450, 700]}
                width={375}
                data={spreadSecondary.reference}
              />
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

interface SpreadMediaProps {
  data: Media;
  loading?: HTMLImageElement['loading'];
  scale?: 2 | 3;
  sizes: string;
  width: number;
  widths: number[];
}

function SpreadMedia({
  data,
  loading,
  scale,
  sizes,
  width,
  widths,
}: SpreadMediaProps) {
  if (data.mediaContentType === 'VIDEO') {
    return (
      <Video
        previewImageOptions={{scale, src: data.previewImage!.url}}
        width={scale! * width}
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
        widths={widths}
        sizes={sizes}
        alt={data.alt || 'Marketing Banner Image'}
        className="block object-cover w-full h-full"
        // @ts-ignore
        data={data.image}
        loading={loading}
        width={width}
        loaderOptions={{scale}}
      />
    );
  }

  return null;
}
