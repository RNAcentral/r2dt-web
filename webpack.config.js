const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const dotenv = require('dotenv').config({ path: __dirname + '/.env' });

module.exports = (env, argv) => {
    const isProduction = argv.mode === 'production';

    return {
        entry: './src/app.js',
        output: {
            filename: 'r2dt-web.js',
            path: path.resolve(__dirname, 'dist'),
            clean: true,
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env']
                        }
                    }
                }
            ]
        },
        plugins: [
            // Read environment variable
            new webpack.DefinePlugin({
                'process.env.BRANCH': JSON.stringify(process.env.BRANCH || 'prod')
            }),
            // Use index.html for development (not included in production build)
            ...(!isProduction ? [
                new HtmlWebpackPlugin({
                    template: './src/index.html',
                    inject: 'body',
                })
            ] : [])
        ],
        mode: isProduction ? 'production' : 'development',
        devtool: isProduction ? 'source-map' : 'eval-source-map',
        devServer: {
            static: {
                directory: path.join(__dirname, 'dist'),
            },
            compress: true,
            port: 9000,
            hot: true,
            open: true,
        },
    };
};
