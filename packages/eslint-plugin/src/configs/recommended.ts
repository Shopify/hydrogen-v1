import {merge} from '../utilities';

import core from './core';
import hydrogen from './hydrogen';

const recommended = merge(core, hydrogen);

export default recommended;
