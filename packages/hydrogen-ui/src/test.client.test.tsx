import {describe, it, assert} from 'vitest';
import {COOLNUMBER, Test} from './test.client';
import * as React from 'react';

describe(`Test Client`, () => {
  it(`Coolnumber`, () => {
    assert.equal(COOLNUMBER, 42);
  });

  it(`component`, () => {});
});
