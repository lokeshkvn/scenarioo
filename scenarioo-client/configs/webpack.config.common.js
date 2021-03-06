var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');

var webpackCommonConfig = {

    entry: {
        app: './app/app.js'
    },

    output: {
        path: __dirname + '/dist',
        filename: 'app.bundle.js'
    },

    module: {
        rules: [
            {
                test: /\.(jpg|jpeg|gif|png|ico)$/,
                include: /images/,
                loader: 'file-loader?name=/images/[name].[ext]'
            },
            {
                test: /\.html$/,
                loader: "raw-loader",
                exclude: '/node_modules'
            },
            {
                test: /\.css$/,
                loader: "style-loader!css-loader",
                exclude: '/node_modules'
            },
            {
                test: /\.less/,
                loader: "style-loader!css-loader!less-loader",
                exclude: '/node_modules'
            },
            {
                test: /\.(woff|woff2|eot|ttf)$/i,
                loader: "file-loader?name=fonts/[name]-[hash].[ext]"
            },
            {
                test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
                loader: "url-loader?limit=10000&minetype=image/svg+xml"
            }
        ],
    },
    plugins: [
        new webpack.ProvidePlugin({
            jQuery: 'jquery',
            $: 'jquery',
            jquery: 'jquery',
            'window.jQuery': 'jquery'
        }),
        new HtmlWebpackPlugin({
            template: './app/index.html'
        }),
        new CopyWebpackPlugin([{
            from: './app/images', to: 'images'
        }])
    ]
};


module.exports = webpackCommonConfig;
