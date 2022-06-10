import {Link, Image} from '@shopify/hydrogen';

export function LocationCard({to, data}) {
  if (!data) return null;
  return (
    <Link to={to || `/locations/${data.handle}`} className="grid gap-4">
      <div className="card-image">
        {data?.featured_image?.reference?.image && (
          <Image
            className="object-cover aspect-[3/2]"
            data={data.featured_image.reference.image}
          />
        )}
      </div>
      <div>{data.title.value}</div>
    </Link>
  );
}
