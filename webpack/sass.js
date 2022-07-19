const MiniCssExtractPlugin = require("mini-css-extract-plugin");
module.exports = function(paths) {

    return {
        module: {
            rules: [
                {
                    test: /\.scss$/,
                    include: paths,
                    use: [
                        MiniCssExtractPlugin.loader,
                        'css-loader',
                        'sass-loader'
                    ]
                }
            ]
        }
    };
}