module.exports = function (env, options = {}) {
	const { production: isProd, rhl: isRHLEnabled, refresh } = env || {};

	return {
		presets: [
			[
				require.resolve('@babel/preset-env'),
				{
					loose: true,
					modules: options.modules || false,
					targets: {
						browsers: options.browsers,
					},
					exclude: ['transform-regenerator', 'transform-async-to-generator'],
				},
			],
		],
		plugins: [
			require.resolve('@babel/plugin-syntax-dynamic-import'),
			require.resolve('@babel/plugin-transform-object-assign'),
			[require.resolve('@babel/plugin-proposal-decorators'), { legacy: true }],
			[
				require.resolve('@babel/plugin-proposal-class-properties'),
				{ loose: true },
			],
			require.resolve('@babel/plugin-proposal-object-rest-spread'),
			isProd &&
				require.resolve('babel-plugin-transform-react-remove-prop-types'),
			[require.resolve('fast-async'), { spec: true }],
			require.resolve('babel-plugin-macros'),
			[
				require.resolve('@babel/plugin-transform-react-jsx'),
				{ pragma: 'h', pragmaFrag: 'Fragment' },
			],
		].filter(Boolean),
		overrides: [
			// Transforms to apply only to first-party code:
			{
				exclude: /(^|\/|\\)node_modules(\/|\/)/,
				presets: [
					[require.resolve('@babel/preset-typescript'), { jsxPragma: 'h' }],
				],
				plugins: [
					!isProd && refresh && require.resolve('react-refresh/babel'),
					!isProd && isRHLEnabled && require.resolve('react-hot-loader/babel'),
				].filter(Boolean),
			},
		],
	};
};
