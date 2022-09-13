import * as React from 'react';
import type {Story} from '@ladle/react';
import {MediaFile} from './MediaFile.js';
import {getMedia} from './MediaFile.test.helpers.js';

const Template: Story<React.ComponentPropsWithoutRef<typeof MediaFile>> = (
  props
) => {
  return <MediaFile {...props} />;
};

export const MediaImage = Template.bind({});
MediaImage.args = {
  data: getMedia('MediaImage'),
};

export const Video = Template.bind({});
Video.args = {
  data: getMedia('Video'),
};

export const ExternalVideo = Template.bind({});
ExternalVideo.args = {
  data: getMedia('ExternalVideo'),
};

export const Model3d = Template.bind({});
Model3d.args = {
  data: getMedia('Model3d'),
};
