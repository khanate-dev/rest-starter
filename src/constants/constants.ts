export const jwtSecret = '57731062324a678ae936796f625cb6fd';

export const encryption = {
	iterations: 1000000,
	pepper: '4c62017971d2a8f68f86bc96b4b95e70556592c4',
};

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
	prefix: /mongodb(\+srv)?:\/\//iu,
	host: /[a-zA-Z0-9-_.:@]+/iu,
	collection: /\/?[a-zA-Z0-9-_.]*/iu,
	params: /(\?([a-zA-Z0-9-_.]+=[a-zA-Z0-9-_.]+&?)*)?/iu,
};

export const regex = {
	phone:
		/^(\+?\d{0,4})?\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{4}\)?)?$/u,
	age: new RegExp(`^[0-9]+s?(${ageUnits.join('|')})?$`, 'iu'),
	publicKey: /^-----BEGIN PUBLIC KEY-----.+-----END PUBLIC KEY-----$/su,
	privateKey:
		/^-----BEGIN RSA PRIVATE KEY-----.+-----END RSA PRIVATE KEY-----$/su,
	mongoSrv: new RegExp(
		`^${Object.values(mongo)
			.map((r) => r.source)
			.join('')}$`,
		'iu',
	),
	mongoId: /^[a-f\d]{24}$/iu,
};
