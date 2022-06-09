import {Link, Image} from '@shopify/hydrogen';
import {Grid, Section} from '~/components/elements';

// TODO: This should be consolidated with FeaturedCollections into a more generic presentational component
export function Locations({title = 'Locations', data}) {
  return (
    <Section heading={title}>
      <Grid items={data.length}>
        {data && data.map((location, i) => <Card data={location} key={i} />)}
      </Grid>
    </Section>
  );
}

Locations.displayName = 'Locations';

// TODO: Abstract this duplicate (also found in /routes/locations/index.server.jsx)
function Card({to, data}) {
  return (
    <Link to={to || `/locations/${data.handle}`} className="grid gap-4">
      <div className="card-image">
        <Image
          alt={
            data.featured_image.reference.image.altText ||
            `Image of the ${data.title.value} location`
          }
          className="object-cover aspect-[3/2]"
          data={data.featured_image.reference.image}
        />
      </div>
      <div>{data.title.value}</div>
    </Link>
  );
}

Card.displayName = 'Card';
