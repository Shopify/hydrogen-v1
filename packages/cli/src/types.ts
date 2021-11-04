import {Workspace} from './workspace';
import {Ui} from './ui';
import {Fs} from './fs';

import {Feature} from './utilities/feature';

export interface Env<Context = {}> {
  ui: Ui;
  workspace: Workspace;
  fs: Fs;
  context?: Context;
}

export interface TemplateOptions {
  ifFeature(feature: Feature, output: string): string;
  features: Feature[];
  storeDomain: string;
  storefrontToken: string;
  name: string;
}
