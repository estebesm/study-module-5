const path = require('path');
const {merge} = require('webpack-merge');
const devServer = require('./webpack/devServer');
const sass = require('./webpack/sass');
const images = require('./webpack/images');

const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin")

const fs = require("fs");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const PATHS = {
    source: path.join(__dirname, 'src'),
    build: path.join(__dirname, 'build')
}
const PAGES_DIR = `${path.resolve(__dirname, "src")}/pages/`;
const PAGES_DIRS = fs.readdirSync(PAGES_DIR).map(dir => `${path.resolve(__dirname, "src")}/pages/${dir}`);

const PAGES = PAGES_DIRS.map(dir => ({
    filenames: fs.readdirSync(dir).filter(filename => filename.endsWith(".html")),
    path: dir
}));

const res = [];

PAGES.forEach(page => page.filenames.forEach(filename => {
    res.push( new HtmlWebpackPlugin({
        template: `${page.path}/${filename}`,
        chunks: [filename.substring(0, filename.length-5)],
        filename: `${filename.replace(/\.html/, '.html')}`
    }));
}));

const common = merge([
    {
        mode: "production",
        entry: {
            "index": PATHS.source + "/pages/index/index.js",
            "auth": PATHS.source + "/pages/auth/auth.js",
            "profile": PATHS.source + "/pages/profile/profile.js"
        },
        output: {
            path: PATHS.build,
            filename: "[name].js"
        },
        plugins: [
            new MiniCssExtractPlugin(),
            new CopyPlugin({
                patterns: [
                    { from: "src/assets", to: "assets" }
                ],
            }),
            ...res
        ],
    },
    sass(),
    images()
]);

module.exports = function (env, argv){
    if(argv.mode === "production"){
        return common;
    }
    if(argv.mode === "development"){
        return merge([
            common,
            devServer()
        ]);
    }
}