const path = require('path');
const webpack = require('webpack');
// 生成html
const HtmlWebpackPlugin = require('html-webpack-plugin');

// 生成css
const ExtractTextPlugin = require("extract-text-webpack-plugin");

// 每次打包清除build文件
const CleanWebpackPlugin = require('clean-webpack-plugin');

// 获取页面数据
const pages = require('./page.js');
const pagesKeys = Object.keys(pages);
const html = {};
pagesKeys.map(function (v, k) {
    html[v] = pages[v].url;
});


const config = {
    //页面入口文件配置
    entry: html,
    //入口文件输出配置
    output: {
        path: path.resolve(__dirname, './build'),
        filename: './js/[name][hash].js'
    },
    // 配置 服务器环境
    devServer: {
        historyApiFallback: true,
        inline: true,
        port: 8888,
        // contentBase: './',
        //跨域
        // proxy: {
        //     '*': {
        //         target: 'http://192.168.92.127:8080/',
        //         secure: false,
        //     }
        // },
    },
    // 加载器
    module: {
        rules: [
            // 加载sass
            {
                test: /\.(scss|css)$/,
                // use: [{
                //     loader: "style-loader" // creates style nodes from JS strings
                // }, {
                //     loader: "css-loader" // translates CSS into CommonJS
                // }, {
                //     loader: "sass-loader" // compiles Sass to CSS
                // }]

                // 独立css 步骤一
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: ['css-loader', 'sass-loader', 'postcss-loader'],
                })
            },
            // 加载图片
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [{
                    // limit - 小于多少字节 使用base64编码 不打包
                    // name - 生成对应路径的图片名
                    loader: "url-loader?limit=8192&name=./images/[name][hash].[ext]"
                }]
            },
            // 加载字体
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: [{
                    loader: 'file-loader'
                }]
            },
            // 加载es6语法
            {
                test: /\.(js|jsx|es6)$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['env']
                    }
                }
            },
            //　加载vue
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    // 独立vue 中css文件
                    extractCSS: true
                }
            }
        ]
    },
    // 插件
    plugins: [
        // 独立css 步骤二
        new ExtractTextPlugin({
            filename: "./css/[name][hash].css",
            disable: false,
            allChunks: true
        }),
        // 压缩js
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
                drop_debugger: true,
                drop_console: true
            }
        }),
        // // 压缩css
        new webpack.LoaderOptionsPlugin({
            minimize: true
        }),

        // 热加载 (好像没有什么卵用)
        //new webpack.HotModuleReplacementPlugin(),

        // 提取公共js文件 (暂时没有找到提取公共css方法)
        new webpack.optimize.CommonsChunkPlugin({
            name: "commons",
            filename: "./js/commons[hash].js",
            // 公共文件最小 应用数量
            minChunks: 3,
        }),

        // 每一次打包清除build文件夹
        new CleanWebpackPlugin(['build']),
    ]
};

pagesKeys.map(function (v, k) {
    var date = new HtmlWebpackPlugin({
        title: pages[v].title,
        // 生成对应html 以及路径
        filename: './' + v + '.html',
        inject: true,
        // 每一个页面对应的html模板
        template: './src/template/' + v + '.html',
        minify: { //压缩HTML文件
            removeComments: true, //移除HTML中的注释
            collapseWhitespace: false //删除空白符与换行符
        }
    });
    config.plugins.push(date);
});

module.exports = config;