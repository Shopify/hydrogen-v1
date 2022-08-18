import React from 'react';
import {defineSection, CacheShort} from '@shopify/hydrogen';

const ErrorWithPage = () => {
  return <p>Working GQL {names}</p>;
};

export const TestErrorWithPage = defineSection({
  section: 'TestErrorWithPage',
  component: ErrorWithPage,
  cache: CacheShort(),
});
