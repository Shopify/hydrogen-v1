import {eventNames} from './const';
const RESERVED_EVENT_NAMES = Object.values(eventNames);

export function getNamedspacedEventname(eventname: string): string {
  // Any event name that is not in the reserved space will be prefix with `c-`
  return RESERVED_EVENT_NAMES.indexOf(eventname) === -1
    ? `c-${eventname}`
    : eventname;
}
