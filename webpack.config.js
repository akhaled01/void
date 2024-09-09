import HtmlWebpackPlugin from "html-webpack-plugin";
import { resolve as _resolve, join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default {
  entry: "./src/index.js",
  output: {
    path: _resolve(__dirname, "dist"),
    filename: "bundle.js",
  },
  resolve: {
    extensions: [".js", ".jsx"],
    alias: {
      Components: _resolve(__dirname, "src/components/"),
      Core: _resolve(__dirname, "core/"),
    },
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: "swc-loader",
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./index.html", // Copy index.html to dist/
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
