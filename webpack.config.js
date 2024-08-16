const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");
const glob = require('glob');

module.exports = {
  // Entry: Dynamically include all JS files in the src folder
  entry: glob.sync('src/assets/**/*.js').reduce((entries, file) => {
    console.log(file, 'file');
    const entry = file.replace('src/', '').replace('.js', '');
    entries[entry] = `./${file}`;
    return entries;
  }, {}),

  // Output: Output files into the dist folder maintaining the src folder structure
  output: {
    filename: '[name].bundle.js', // Bundled JS files
    path: path.resolve(__dirname, 'dist'),
  },

  // Module rules: Handle different file types
  module: {
    rules: [
      // Rule for JavaScript: Transpile and bundle JS files
      // {
      //   test: /\.js$/,
      //   exclude: /node_modules/,
      //   use: {
      //     loader: 'babel-loader',
      //     options: {
      //       presets: ['@babel/preset-env'],
      //     },
      //   },
      // },
      // Rule for CSS: Extract and minify CSS files
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      // Rule for images: Copy images to dist folder
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'assets/[name][ext]',
        },
      },
      // Rule for fonts: Copy fonts to dist folder
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'assets/[name][ext]',
        },
      },
    ],
  },

  // Plugins: Handle additional tasks like minifying CSS and extracting it into files
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'assets/css/[name].css',
    }),

    new CopyPlugin({
      patterns: [
        {
          from: "**/*.liquid",
          to: "./",
          context: "src/",
        },
      ],
    }),

    new CopyPlugin({
      patterns: [
        {
          from: "assets/*.css",
          to: "./",
          context: "src/",
        },
      ],
    }),
  ],

  // Optimization: Minimize JS and CSS files
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: true,
        },
      }),
      new CssMinimizerPlugin(),
    ],
  },

  // Mode: Set to production to automatically enable optimizations like minification
  mode: 'production',

  // Devtool: Source map support (optional, remove in production if not needed)
  devtool: 'source-map',
};
