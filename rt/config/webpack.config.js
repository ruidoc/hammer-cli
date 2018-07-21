
var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlPlugin = require('html-webpack-plugin')
var vueLoderConf = require('./vue-loader.conf')

function resolve(dir) {
    return path.resolve(__dirname, '../', dir)
}
module.exports = (env = {page:'index'}, argv )=> {
    let page = env.page
    return {
        entry: `./src/entry/${page}.js`,
        output: {
            filename: `js/[name].js`,
            chunkFilename: `js/chunck/[name].js`,
            path: resolve(`dist/${page}`),
        },
        module: {
            // noParse: /jquery|lodash/,
            rules: [
                {
                    test: /\.vue$/,
                    loader: 'vue-loader',
                    options: vueLoderConf
                },
                {
                    test: /\.css$/,
                    use: ExtractTextPlugin.extract({
                        use: ['css-loader','postcss-loader']
                    })
                },
                {
                    test: /\.js$/,
                    loader: 'babel-loader',
                    options: {
                        cacheDirectory: true
                    },
                    include: resolve('src')
                }
            ]
        },
        plugins: [
            new ExtractTextPlugin({
                filename: `css/[name].css`,
            }),
            new HtmlPlugin({
                filename: 'index.html',
                template: `pages/${page}.html`,
                minify: true
            })
            // new webpack.HotModuleReplacementPlugin()
        ],
        resolve: {
            extensions: ['.js','.json'],
            alias: {
                '@': resolve('src/components')
            }
        },
        // devtool: 'source-map',
        devServer: {
            host: '0.0.0.0',
            https: true,
            compress: true,
            // progress: true
        }
    }
};