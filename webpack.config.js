const path = require('path')
const webpack = require('webpack')

const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");
const TerserPlugin = require('terser-webpack-plugin');


const IS_DEVELOPMENT = process.env.MODE_ENV === 'dev'

const dirApp = path.join(__dirname, 'app')
const dirShared = path.join(__dirname, 'shared')
const dirStyles = path.join(__dirname, 'styles')
const dirNode = 'node_modules'


module.exports = {
    entry: [
        path.join(dirApp, 'index.js'),
        path.join(dirStyles, 'index.scss')
    ],

    resolve: {
        modules: [
            dirApp,
            dirShared,
            dirStyles,
            dirNode,
        ],
    },

    plugins: [
        new webpack.DefinePlugin({
            IS_DEVELOPMENT
        }),

        new CleanWebpackPlugin(),

        new CopyWebpackPlugin({
            patterns: [{

                from: './shared',
                to: ''

        }]
        }),
        
        new MiniCssExtractPlugin({
            filename: '[name].css',
            chunkFilename: '[id].css'
        }),

        new ImageMinimizerPlugin({
            minimizer: {
                implementation: ImageMinimizerPlugin.imageminMinify,
                options: {
                plugins: [
                    ['gifsicle', {interlaced: true}],
                    ['jpegtran', {progressive: true}],
                    ['optipng', {optimizationLevel: 8}],
                ]},
            },
        }),
    ],

    module: {
        rules: [
            {
            test: /\.js$/,
            use: {
                loader: 'babel-loader'
            }
    },
    
            {
            test: /\.scss$/i,
            use: [
                {
                    loader: MiniCssExtractPlugin.loader,
                    options: {
                        publicPath: ''
                    }
                },

                
                    'css-loader',
                

              
                    'postcss-loader',
                

              
                    'sass-loader',
                
            ]
        },

        {
            test: /\.(jpe?g|png|svg|gif|woff2?|fnt|webp)$/,
            loader: 'file-loader',
            options: {
                name (file) {
                    return '[hash].[ext]'
                } 
            }
        },

          // We recommend using only for the "production" mode
          {
            test: /\.(jpe?g|png|gif|svg|webp)$/i,
            use: [
              {
                loader: ImageMinimizerPlugin.loader,
              },
            ],
          },
        
        {
            test:/\.(glsl|frag|vert)$/,
            loader: 'raw-loader',
            exclude:/node_modules/
        },

        {
            test:/\.(glsl|frag|vert)$/,
            loader: 'glslify-loader',
            exclude: /node_modules/
        }
        ],
      },

      optimization: {
        minimize: true,
        minimizer: [new TerserPlugin()],
      }
    };