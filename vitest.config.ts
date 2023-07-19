/* eslint-disable import/no-default-export */
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [tsconfigPaths()],
	test: {
		globals: true,
		clearMocks: true,
		coverage: {
			enabled: true,
			reporter: ['html'],
		},
		environment: 'node',
		typecheck: {
			include: ['**/*.test.{ts,tsx}'],
		},
	},
});
