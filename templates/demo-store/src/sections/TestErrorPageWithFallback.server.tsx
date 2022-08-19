import {defineSection, CacheShort} from '@shopify/hydrogen';

const ErrorWithFallback = () => (
  <div className="border border-notice p-6">
    <p>Oopsie! Try again later!</p>
  </div>
);

const ErrorWithPage = () => {
  return <p>Working GQL {names}</p>;
};

export const TestErrorWithPageWithFallback = defineSection({
  section: 'TestErrorWithPageWithFallback',
  component: ErrorWithPage,
  cache: CacheShort(),
  fallback: ErrorWithFallback,
});
