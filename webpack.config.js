import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import CopyPlugin from "copy-webpack-plugin";
import ESLintWebpackPlugin from "eslint-webpack-plugin";
import { resolve as _resolve, join, dirname } from "path";
import { fileURLToPath } from "url";
import webpack from "webpack";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default {
  entry: "./src/index.ts",
  output: {
    path: _resolve(__dirname, "dist"),
    filename: "bundle.js",
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx"],
    alias: {
      Components: _resolve(__dirname, "src/components/"),
      Core: _resolve(__dirname, "core/"),
      CSS: _resolve(__dirname, "css/"),
    },
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: [
          {
            loader: "ts-loader",
            options: {
              transpileOnly: true, // Use SWC for transpilation
            },
          },
          {
            loader: "swc-loader",
            options: {
              jsc: {
                parser: {
                  syntax: "typescript",
                  jsx: true,
                },
              },
            },
          },
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "swc-loader",
          options: {
            jsc: {
              parser: {
                syntax: "ecmascript",
                jsx: true,
              },
              transform: {
                react: {
                  runtime: "automatic",
                },
              },
            },
          },
        },
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./index.html", // Copy index.html to dist/
    }),
    new MiniCssExtractPlugin(),
    new CopyPlugin({
      patterns: [
        {
          from: _resolve(__dirname, "css"), // Source directory
          to: _resolve(__dirname, "dist/css"), // Destination directory
          globOptions: {
            ignore: ["**/ignored-file.css"], // If you need to ignore specific files
          },
        },
        {
          from: _resolve(__dirname, "globals.css"),
          to: _resolve(__dirname, "dist/globals.css"),
        },
      ],
    }),
    new webpack.ProvidePlugin({
      createElement: ["Core/DOM/createElement", "createElement"], // Automatically import `createElement`
    }),
  ],
  devServer: {
    static: {
      directory: join(__dirname, "dist"), // Serve files from dist
    },
    compress: true,
    port: 9000,
    open: true,
    historyApiFallback: true, // Ensures that all routes serve index.html
  },
  mode: "development",
};
