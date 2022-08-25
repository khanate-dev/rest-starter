export interface Config {
	port: number,
	dbUri: string,
	hashing: {
		iterations: number,
		pepper: string,
	},
}