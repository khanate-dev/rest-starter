import { pino } from 'pino';

export const logger = pino({
	base: {
		pid: false,
	},
	transport: {
		options: {
			colorize: true,
		},
		target: 'pino-pretty',
	},
});

const variants = {
	reset: 0,
	bold: 1,
	dim: 2,
	italic: 3,
	underline: 4,
	inverse: 7,
	hidden: 8,
	strikethrough: 9,
};

const colors = {
	black: 30,
	red: 31,
	green: 32,
	yellow: 33,
	blue: 34,
	magenta: 35,
	cyan: 36,
	white: 37,
	gray: 90,
	grey: 90,
};

type Variants = keyof typeof variants;
type Colors = keyof typeof colors;
type BgColors = `${Colors}-bg`;

/** Modifies the console output */
export const stylized = (
	message: string | number | boolean,
	style: Variants | Colors | BgColors,
	styleAfter: Variants | Colors | BgColors = 'reset',
) => {
	const [key, bg] = style.split('-') as [Variants | Colors, 'bg' | undefined];
	const code = { ...variants, ...colors }[key] + (bg ? 10 : 0);
	const [nextKey, nextBg] = styleAfter.split('-') as [
		Variants | Colors,
		'bg' | undefined,
	];
	const nextCode = { ...variants, ...colors }[nextKey] + (nextBg ? 10 : 0);
	return `\u001b[${code}m${message}\u001b[${nextCode}m`;
};
