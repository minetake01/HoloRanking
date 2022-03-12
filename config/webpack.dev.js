const { merge } = require('webpack-merge');
const webpackConfig = require('./webpack.common.js');

module.exports = merge(webpackConfig, {
	mode: 'development',
	devServer: {
		historyApiFallback: true,
		open: true,
		host: 'localhost',
		port: 8080,
		hot: true,
		proxy: {
			'/HoloRanking/api/**': {
				target: 'http://localhost:3000',
				secure: false,
			}
		},
	}
})