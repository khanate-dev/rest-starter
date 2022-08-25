export default {
	port: 1337,
	dbUri: 'mongodb://127.0.0.1:27017/typescript-node-rest',
	hashing: {
		iterations: 1000000,
		pepper: '4c62017971d2a8f68f86bc96b4b95e70556592c4',
	},
	accessTokenTtl: '-1',
	refreshTokenTtl: '1y',
	publicKey: `-----BEGIN PUBLIC KEY-----
MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAMLDWsIylJtvWAvfLvRjKt6bBYUuBTAK
t9/lN0xpj+NFJGsG07cj+vkaJxxtnfcblAW92IoLvMnra2j0RKtsQrMCAwEAAQ==
-----END PUBLIC KEY-----`,
	privateKey: `-----BEGIN RSA PRIVATE KEY-----
MIIBOwIBAAJBAMLDWsIylJtvWAvfLvRjKt6bBYUuBTAKt9/lN0xpj+NFJGsG07cj
+vkaJxxtnfcblAW92IoLvMnra2j0RKtsQrMCAwEAAQJBAJ+pwtd827Lo/ocM+dND
ELvY3hel+H6/6qlToZe02k52yqAryRwx32SZGJK37i/mzHxKOsJUQe6vFzvubLV+
JOECIQD0ZrazuJT4Nef94RoTtOH0Cdk5FuWXl/VlrR1oqHq86QIhAMwBk3J5pp4/
whM3/Q1wDKRrb7cg9+fAdx+cplcIVVE7AiEA8rF4phkaXSxylkpM8drCMesBuU5C
aXntpqz0sjPzxdkCIBai9iF1ri9RE8/eHo4nKL/1y+eeGOP2T0GKuEpf+leRAiBj
Fp8LNbguAV7zKJeAyNDVwnIYH/a/reoHm2Sckfjfcg==
-----END RSA PRIVATE KEY-----`,
};