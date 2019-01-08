import path from 'path';
import CleanPlugin from 'clean-webpack-plugin';
import HtmlPlugin from 'html-webpack-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import UglifyJsPlugin from 'uglifyjs-webpack-plugin';
import OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin';
import CopyPlugin from 'copy-webpack-plugin';
import yargs from 'yargs';

var argv = yargs.count('production')
    .alias('p', 'production').argv;

var nodeEnv = argv.production ? 'production' : 'development';
console.log('environment: '+nodeEnv);

export default {
    entry: './src/entrypoint.js',
    output: {
        path: path.resolve(__dirname, './dist/'),
        filename: '[name].js'
    },
    mode: nodeEnv,
    devtool: nodeEnv == 'development' ? 'source-map' : false,
    devServer: {
        contentBase: './dist'
    },
    optimization: {
        minimizer: [
            new UglifyJsPlugin({
                cache: true,
                parallel: true,
                sourceMap: true // set to true if you want JS source maps
            }),
            new OptimizeCSSAssetsPlugin({})
        ]
    },
    module: {
        rules: [{
            test: /\.less$/,
            exclude: /(node_modules)/,
            loader: ExtractTextPlugin.extract({
                fallback: 'style-loader',
                use: ['css-loader', 'less-loader']
            })
        }, {
            test:  /\.m?js$/,
            exclude: /(node_modules)/,
            use: [
                {
                    loader: 'babel-loader',
                    options: {
                        cacheDirectory: path.resolve(__dirname, './.babel-cache/')
                    }
                },
                {
                    loader: 'eslint-loader',
                    options: {
                        failOnError: nodeEnv === 'production'
                    }
                }
            ]
        }]
    },
    plugins: [
        new CleanPlugin('./dist'),
        // TODO: this is temporary! Must find better asset bundling method which works with PIXI
        new CopyPlugin([{
            from: './src/assets/*',
            to: './assets/[name].[ext]'
        }]),
        new HtmlPlugin({
            template: 'src/index.html',
            inject: 'head'
        }),
        new ExtractTextPlugin('styles.css')
    ],
    externals: {
        'underscore': '_',
        'buckets-js': 'buckets',
        'pixi.js': 'PIXI'
    }
};