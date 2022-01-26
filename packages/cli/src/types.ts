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
  /** unique id of the check **/
  id: string;
  /** category type for grouping common checks **/
  type: 'Setup' | 'Dependencies' | 'Deployment' | 'Performance';
  /** short description of the check **/
  description: string;
  /** indicates whether the current project meets the requirements of the check **/
  success: boolean;
  /**link to learn more about the check **/
  link?: string;
  /** optional function to correct the problems in the current project **/
  fix?: (env: Env) => void;
}

export type Loggable = string | ((env: Env) => string);
