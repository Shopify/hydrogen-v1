// TODO: Custom Content Model
import {useShopQuery, useRouteParams, Seo, gql, Image} from '@shopify/hydrogen';
import {DefaultLayout as Layout} from '~/components/layouts';
import {NotFound} from '~/components/pages';
import {Text, Button, Heading} from '~/components/elements';
import {formatPhoneNumber} from '~/lib/utils';
import {location as mockLocation} from '~/lib/placeholders';

export default function Location({params}) {
  const {handle} = useRouteParams();

  const {data} = useShopQuery({
    query: QUERY,
    variables: {
      handle,
    },
    preload: true,
  });

  if (data?.metaobject == null) {
    return <NotFound type="location" />;
  }

  const {featured_image, title, address, hours, email, phone} = data.metaobject;

  const directions_link = `https://www.google.com/maps/dir/?api=1&destination=${address.value.replace(
    /(\r\n|\n|\r)/gm,
    '',
  )}`;

  return (
    <Layout>
      <section className="flex flex-col items-center gap-12 pb-16 md:flex-row">
        <Image
          className="object-cover w-full md:w-1/2 md:aspect-[2/3] lg:aspect-square aspect-square"
          width={1000}
          height={1000}
          data={featured_image.reference.image}
        />
        <div className="grid w-full gap-8 md:w-1/2">
          <h1 className="text-2xl">{title.value}</h1>
          <div className="flex flex-col gap-8 md:flex-row">
            <div className="grid gap-8">
              <div className="grid gap-2">
                <Heading as="h3" size="copy">
                  Address
                </Heading>
                <address
                  className="not-italic"
                  dangerouslySetInnerHTML={{
                    __html: address.value.replace(/(?:\r\n|\r|\n)/g, '<br/>'),
                  }}
                />
                <a
                  className="underline"
                  href={directions_link}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <Text>Get directions</Text>
                </a>
              </div>
              <div className="grid gap-2">
                <Heading as="h3" size="copy">
                  Contact us:
                </Heading>
                <a className="underline" href={`tel:${phone.value}`}>
                  <Text>{formatPhoneNumber(phone.value)}</Text>
                </a>
                <a className="underline" href={`mailto:${email.value}`}>
                  <Text>{email.value}</Text>
                </a>
              </div>
            </div>
            <div className="flex flex-col items-start gap-2">
              <Heading as="h3" size="copy">
                Hours
              </Heading>
              <ul>
                {JSON.parse(hours.value).map((hour, i) => (
                  <Text as="li" key={i}>
                    {hour}
                  </Text>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}

const QUERY = gql`
  query store($handle: String!) {
    metaobject(byHandle: {type: "stores", handle: $handle}) {
      id
      featured_image: field(key: "featured_image") {
        reference {
          ... on MediaImage {
            image {
              url
              width
              height
            }
          }
        }
      }
      title: field(key: "title") {
        value
      }
      address: field(key: "address") {
        value
      }
      hours: field(key: "hours") {
        value
      }
      email: field(key: "email") {
        value
      }
      phone: field(key: "phone") {
        value
      }
    }
  }
`;
