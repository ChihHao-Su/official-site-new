import path from 'node:path';
import { fileURLToPath } from 'node:url'

import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
//const MiniCssExtractPlugin = require('mini-css-extract-plugin');
import WarningsToErrorsPlugin from 'warnings-to-errors-webpack-plugin';
import HtmlBundlerPlugin from 'html-bundler-webpack-plugin';

// https://zellwk.com/blog/dirname-node-esm/
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default  (env, argv) => ({
  output: {
    path: path.resolve(__dirname, './build'),
  },
  plugins: [
    new HtmlBundlerPlugin({
      test: /\.html$/,
      entry: "./front-end/src",
      output: {
        path: path.resolve(__dirname, './build')
      },
      loaderOptions: {
        preprocessor: 'ejs',
      },
      js: {
        filename: './build/js/[name].[contenthash:8].js'
      },
      css: {
        filename: './build/css/[name].[contenthash:8].css',
      }
    }),
    new CssMinimizerPlugin()
  ],
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          {
            loader: 'css-loader',
            //options: { importLoaders: 1 }
          },
          'sass-loader',
        ]
      },
      // {
      //   test: /\.css$/,
      //   use: [
      //     {
      //       loader: 'css-loader',
      //       options: { importLoaders: 1 }
      //     },
      //   ]
      // },
      
      {
        test: /\.(ico|png|jp?g|webp|svg)$/,
        type: 'asset/resource',
        generator: {
          filename: 'img/[name].[hash:8][ext][query]',
        },
      }
      // }
      // {
      //   test: /\.html$/i,
      //   exclude: /node_modules/,
      //   use: 'raw-loader',
      // },
    ]
  },
  resolve: {
    modules: [
      path.resolve(__dirname, './front-end/src'),
      'node_modules'
    ],
  },
  devServer: {
    port: 8088,
    compress: true,
    liveReload: true
    // proxy: [
    //   {
    //     context: '/back-end/api/',
    //     target: 'http://localhost:80/',
    //     secure: false,
    //     headers: {
    //       'X-Devserver': '1',
    //       "Access-Control-Allow-Origin": "*",
    //     }
    //   }
    // ]
  }
});
