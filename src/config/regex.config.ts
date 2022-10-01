export const PHONE_REGEX = /^(\+?\d{0,4})?\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{4}\)?)?$/;

const MONGO_URI_PREFIX_REGEX = /mongodb(\+srv)?:\/\//i;
const MONGO_URI_HOST_REGEX = /[a-zA-Z0-9-_.:@]+/i;
const MONGO_URI_COLLECTION_REGEX = /\/[a-zA-Z0-9-_.]+/i;
const MONGO_URI_PARAMS_REGEX = /(\?([a-zA-Z0-9-_.]+=[a-zA-Z0-9-_.]+&?)*)?/i;
export const MONGO_URI_REGEX = new RegExp(
  '^'
  + MONGO_URI_PREFIX_REGEX.source
  + MONGO_URI_HOST_REGEX.source
  + MONGO_URI_COLLECTION_REGEX.source
  + MONGO_URI_PARAMS_REGEX.source
  + '$',
  'i'
);

const AGE_UNITS = [
  'years', 'year', 'yrs', 'y',
  'weeks', 'week', 'w',
  'days', 'day', 'd',
  'hours', 'hour', 'hrs', 'hr', 'h',
  'minutes', 'minute', 'mins', 'min', 'm',
  'seconds', 'second', 'secs', 'sec', 's',
  'milliseconds', 'millisecond', 'msecs', 'msec', 'ms', 'm',
] as const;

export const AGE_REGEX = new RegExp(
  `^[0-9]+s?(${AGE_UNITS.join('|')})?$`,
  'i'
);

export const PUBLIC_KEY_REGEX = /^-----BEGIN PUBLIC KEY-----.+-----END PUBLIC KEY-----$/s;
export const PRIVATE_KEY_REGEX = /^-----BEGIN PRIVATE KEY-----.+-----END PRIVATE KEY-----$/s;
