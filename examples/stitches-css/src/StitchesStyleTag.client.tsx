import React from 'react';
import {getCssText} from '../stitches.config';
import globalStyles from './globalStyles.client';

export default function StitchesStyleTag() {
  globalStyles();

  return (
    <style
      id="stitches"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{__html: getCssText()}}
    />
  );
}
