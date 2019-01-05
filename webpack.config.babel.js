import path from 'path';
import HtmlPlugin from 'html-webpack-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import yargs from 'yargs';

var argv = yargs.count('production')
    .alias('p', 'production').argv;

var nodeEnv = argv.production ? 'production' : 'development';
console.log('environment: '+nodeEnv);

export default {
    entry: './src/scripts/app.js',
    output: {
        path: path.resolve(__dirname, './dist/'),
        filename: '[name].js'
    },
    mode: nodeEnv,
    module: {
        rules: [{
            test: /\.less$/,
            loader: ExtractTextPlugin.extract({
                fallback: 'style-loader',
                use: 'css-loader!less-loader'
            })
        }, {
            test:  /\.m?js$/,
            exclude: [/(node_modules)/, /\.eslintrc\.js/],
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
        new HtmlPlugin({
            template: 'src/index.html',
            inject: 'head'
        }),
        new ExtractTextPlugin('[name].css')
    ],
    externals: {
        'buckets-js': 'buckets',
        'pixi.js': 'PIXI'
    }
};