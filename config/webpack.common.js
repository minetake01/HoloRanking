const HtmlWebPackPlugin = require("html-webpack-plugin");
const path = require('path')

const htmlWebpackPlugin = new HtmlWebPackPlugin({
	template: "./src/client/index.html",
	filename: "./index.html"
});
module.exports = {
	mode: 'production',
	entry: "./src/client/index.tsx",
	output: {
		path: path.resolve('dist'),
		filename: '[name].js'
	},
	module: {
		rules: [
		{
			test: /\.tsx?$/,
			exclude: /node_modules/,
			use: {
				loader: "babel-loader"
			}
		},
		{
			test: /(\.s[ac]ss)$/,
			use: [
				"style-loader",
				"css-loader",
				"postcss-loader",
				"sass-loader"
			]
		}
		]
	},
	resolve: {
		extensions: [".tsx", ".ts", ".jsx", ".js"]
	},
	plugins: [htmlWebpackPlugin]
};