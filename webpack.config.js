const webpack = require("webpack"),
    path = require("path"),
    env = process.env.NODE_ENV

const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const UglifyJsPlugin = require("uglifyjs-webpack-plugin")
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin")
const CopyWebpackPlugin = require('copy-webpack-plugin')
var projectRootPath = path.resolve(__dirname, './')
module.exports = {
    mode: env || 'development',
    optimization: {
        minimizer: env === 'production' ? [
            new UglifyJsPlugin({
                cache: true,
                parallel: true,
                sourceMap: false
            })
        ] : []
    },
    devtool: env === 'production' ? undefined : 'source-map',
    plugins: [
        new CopyWebpackPlugin([{
            context: './src/assets',
            from: '**/*',
            to: 'assets'
        }])
    ],
    entry: ["./src/index.js", "./src/assets/style/blue.less"],
    output: {
        path: path.join(__dirname, "/dist/"),
        library: "TTKComponent",
        libraryTarget: "umd"
    },

    resolve: {
        extensions: [".js"],
        alias: {
            'edf-app-loader': path.resolve(projectRootPath, './app-loader/index.js'),
            'edf-meta-engine': path.resolve(projectRootPath, './meta-engine/index.js'),
            'edf-utils': path.resolve(projectRootPath, './utils/index.js'),
            'edf-constant': path.resolve(projectRootPath, './constant/index.js'),
        }
    },

    externals: {
        "react": "React",
        "react-dom": "ReactDom",
    },

    module: {
        rules: [{
            test: /\.css$/,
            //exclude: /node_modules/,
            use: [{
                loader: 'style-loader'
            }, {
                loader: 'css-loader'
            }]
        }, {
            test: /\.less$/,
            use: [{
                loader: 'style-loader'
            }, {
                loader: 'css-loader'
            }, {
                loader: 'less-loader',
                options: {
                    javascriptEnabled: true
                }
            }]
        }, {
            test: /\.js?$/,
            exclude: /node_modules/,
            use: 'babel-loader'
        }, {
            test: /\.(eot|woff|woff2|ttf|svg|png|jpe?g|gif|mp4|webm)(\?\S*)?$/,
            use: {
                loader: 'url-loader',
                options: {
                    name: '[name].[hash:8].[ext]',
                    limit: 8192
                }
            }
        }]
    }
}