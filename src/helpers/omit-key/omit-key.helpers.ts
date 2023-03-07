export const omitKey = <
	Type extends Record<string, any>,
	Key extends keyof Type
>(
	input: Type,
	key: Key
): Omit<Type, Key> => {
	// eslint-disable-next-line @typescript-eslint/no-dynamic-delete
	delete input[key];
	return input;
};
