import * as React from 'react';
import type {Story} from '@ladle/react';
import {ExternalVideo, type ExternalVideoProps} from './ExternalVideo.js';
import {getExternalVideoData} from './ExternalVideo.test.helpers.js';

const Template: Story<ExternalVideoProps> = (props) => (
  <ExternalVideo {...props} />
);

export const Youtube = Template.bind({});
Youtube.args = {
  data: getExternalVideoData({
    embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    host: 'YOUTUBE',
  }),
};

export const Vimeo = Template.bind({});
Vimeo.args = {
  data: getExternalVideoData({
    embedUrl: 'https://player.vimeo.com/video/375468729?h=d063a6fe74',
    host: 'VIMEO',
  }),
};
