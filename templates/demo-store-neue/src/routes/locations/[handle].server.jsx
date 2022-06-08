import {useShopQuery, useRouteParams, Seo, gql, Image} from '@shopify/hydrogen';

import {DefaultLayout as Layout} from '~/components/layouts';
import {NotFound} from '~/components/pages';
import {PageHeader, Section} from '~/components/sections';
import {Text, Heading} from '~/components/elements';
import {formatPhoneNumber} from '~/lib/utils';

export default function Location() {
  const {handle} = useRouteParams();

  const {data} = useShopQuery({
    query: QUERY,
    variables: {
      handle,
    },
    preload: true,
  });

  if (data?.contentEntry == null) {
    return <NotFound type="location" />;
  }

  const {featured_image, title, description, address, hours, email, phone} =
    data.contentEntry;

  const directions_link = `https://www.google.com/maps/dir/?api=1&destination=${address?.value?.replace(
    /(\r\n|\n|\r)/gm,
    '',
  )}`;

  return (
    <Layout>
      {title?.value && (
        <PageHeader
          className={
            'grid items-baseline grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
          }
        >
          <div className="grid gap-4 lg:col-span-2">
            <Heading as="h1" size="heading" className="inline-block">
              {title.value}
            </Heading>
            {description?.value && <Text>{description.value}</Text>}
          </div>
          <div className="flex flex-col gap-8 md:flex-row">
            <div className="flex items-start gap-8">
              <div className="grid gap-4">
                {(phone?.value || email?.value) && (
                  <div className="grid justify-start gap-2">
                    <Heading as="h3" size="copy">
                      Contact us:
                    </Heading>
                    {phone?.value && (
                      <a href={`tel:${phone.value}`}>
                        <Text className="pb-px border-b border-primary/50">
                          {formatPhoneNumber(phone.value)}
                        </Text>
                      </a>
                    )}
                    {email?.value && (
                      <a href={`mailto:${email.value}`}>
                        <Text className="pb-px border-b border-primary/50">
                          {email.value}
                        </Text>
                      </a>
                    )}
                  </div>
                )}
                {hours?.value && (
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
                )}
              </div>
              <div className="grid gap-2">
                <Heading as="h3" size="copy">
                  Address
                </Heading>
                {address?.value && (
                  <address
                    className="not-italic"
                    dangerouslySetInnerHTML={{
                      __html: address?.value?.replace(
                        /(?:\r\n|\r|\n)/g,
                        '<br/>',
                      ),
                    }}
                  />
                )}
                {directions_link && (
                  <a
                    href={directions_link}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <Text className="pb-px border-b border-primary/50">
                      Get directions
                    </Text>
                  </a>
                )}
              </div>
            </div>
          </div>
        </PageHeader>
      )}
      <Section>
        <Image
          className="object-cover aspect-[3/2]"
          data={featured_image.reference.image}
        />
      </Section>
    </Layout>
  );
}

const QUERY = gql`
  query store($handle: String!) {
    contentEntry(byHandle: {type: "stores", handle: $handle}) {
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
      description: field(key: "description") {
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
