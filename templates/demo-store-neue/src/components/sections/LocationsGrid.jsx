import {Grid, Section} from '~/components/elements';
import {LocationCard} from '~/components/blocks';

export function LocationsGrid({title = 'Locations', data}) {
  return (
    <Section heading={title}>
      <Grid items={data.length}>
        {(data || []).map((location) => (
          <LocationCard data={location} key={location.id} />
        ))}
      </Grid>
    </Section>
  );
}
