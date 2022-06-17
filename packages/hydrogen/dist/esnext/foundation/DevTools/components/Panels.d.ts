import { ComponentProps } from 'react';
import { Performance } from './Performance.client';
import { Settings } from './Settings.client';
export interface Props {
    settings: ComponentProps<typeof Settings>;
    performance: ComponentProps<typeof Performance>;
}
export declare function Panels({ settings }: Props): JSX.Element;
