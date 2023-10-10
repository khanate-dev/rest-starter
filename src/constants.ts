const ageUnits = [
	'years',
	'year',
	'yrs',
	'y',
	'weeks',
	'week',
	'w',
	'days',
	'day',
	'd',
	'hours',
	'hour',
	'hrs',
	'hr',
	'h',
	'minutes',
	'minute',
	'mins',
	'min',
	'm',
	'seconds',
	'second',
	'secs',
	'sec',
	's',
	'milliseconds',
	'millisecond',
	'msecs',
	'msec',
	'ms',
	'm',
] as const;

const mongo = {
	prefix: /mongodb(\+srv)?:\/\//iu.source,
	host: /[a-zA-Z0-9-_.:@]+/iu.source,
	collection: /\/?[a-zA-Z0-9-_.]*/iu.source,
	params: /(\?([a-zA-Z0-9-_.]+=[a-zA-Z0-9-_.]+&?)*)?/iu.source,
};

export const regex = {
	phone:
		/^(\+?\d{0,4})?\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{4}\)?)?$/u,
	age: new RegExp(`^[0-9]+s?(${ageUnits.join('|')})?$`, 'iu'),
	publicKey: /^-----BEGIN PUBLIC KEY-----.+-----END PUBLIC KEY-----$/su,
	privateKey:
		/^-----BEGIN RSA PRIVATE KEY-----.+-----END RSA PRIVATE KEY-----$/su,
	mongoSrv: new RegExp(
		`^${mongo.prefix}${mongo.host}${mongo.collection}${mongo.params}$`,
		'iu',
	),
	mongoId: /^[a-f\d]{24}$/iu,
};
