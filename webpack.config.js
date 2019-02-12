// webpack.config.js

// eslint-disable-next-line no-undef
module.exports = {
    mode: 'development',
    entry: {
        index: ['babel-polyfill', './src/index.js'],
    },
    output: {
        filename: '[name].js',
    },
    watch: true,
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                    },
                },
            },
        ],
    },
};
