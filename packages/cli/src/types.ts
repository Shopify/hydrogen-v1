import debug from 'debug';
import {Workspace} from './workspace';
import {Ui} from './ui';
import {Fs} from './fs';

import {Feature} from './utilities/feature';

export interface Env<Context = {}> {
  ui: Ui;
  workspace: Workspace;
  fs: Fs;
  context?: Context;
  logger: debug.Debugger;
}

export enum ComponentType {
  Client = 'React client component',
  Shared = 'React shared component',
  Server = 'React server component',
}

export interface TemplateOptions {
  ifFeature(feature: Feature, output: string): string;
  features: Feature[];
  storeDomain: string;
  storefrontToken: string;
  name: string;
}

export interface CheckResult {
  id: string;
  type: 'Setup' | 'Dependencies' | 'Deployment' | 'Performance';
  description: string;
  success: boolean;
  link?: string;
  fix?: (env: Env) => void;
}
