const omitKey = <
	Type extends Record<string, any>,
	Key extends keyof Type
>(
	input: Type,
	key: Key
): Omit<Type, Key> => {
	delete input[key];
	return input;
};

export default omitKey;
