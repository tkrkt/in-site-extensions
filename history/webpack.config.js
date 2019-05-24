const webpack = require("webpack");
const CaseSensitivePathsPlugin = require("case-sensitive-paths-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const FriendlyErrorsWebpackPlugin = require("friendly-errors-webpack-plugin");

const conf = {
  prodMode: process.env.NODE_ENV === "production"
};

module.exports = [
  {
    mode: conf.prodMode ? "production" : "development",
    cache: true,
    entry: {
      background: "./src/background.ts",
      popup: "./src/popup.tsx"
    },
    output: {
      path: __dirname + "/dist",
      filename: "[name].bundle.js"
    },
    resolve: {
      extensions: [".webpack.js", ".web.js", ".ts", ".tsx", ".js"]
    },
    devtool: "source-map",
    module: {
      rules: [
        {
          test: /\.scss$/,
          loaders: ["style-loader", "css-loader", "sass-loader"]
        },
        {
          test: /\.tsx?$/,
          use: {
            loader: "ts-loader",
            options: {
              transpileOnly: true
            }
          },
          exclude: /node_modules/
        }
      ]
    },

    plugins: [
      new CaseSensitivePathsPlugin(),
      new ForkTsCheckerWebpackPlugin(),
      new webpack.DefinePlugin({
        "process.env": {
          NODE_ENV: JSON.stringify(process.env.NODE_ENV)
        }
      }),
      ...(conf.prodMode
        ? []
        : [
            new FriendlyErrorsWebpackPlugin({
              clearConsole: true,
              logLevel: "WARNING"
            })
          ])
    ]
  }
];
