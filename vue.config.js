const path = require("path");
var webpack = require("webpack");

const resolve = dir => {
  return path.join(__dirname, dir);
};

const isProd = process.env.NODE_ENV === "production";

const assetsCDN = {
  // webpack build externals
  externals: {
    vue: "Vue",
    vuex: "Vuex",
    axios: "axios",
    "view-design": "iview",
    "./cptable": "var cptable",
    "./jszip": "jszip",
    echarts: "echarts",
    "monaco-editor": "monaco-editor"
  },
  css: [],
  // https://unpkg.com/browse/vue@2.6.10/
  js: [
    isProd ? "//cdn.jsdelivr.net/npm/vue@2.6.10/dist/vue.min.js" : "//cdn.jsdelivr.net/npm/vue@2.6.10/dist/vue.js",
    "//cdn.jsdelivr.net/npm/vuex@3.1.1/dist/vuex.min.js",
    "//cdn.jsdelivr.net/npm/axios@0.19.0/dist/axios.min.js",
    "//cdn.jsdelivr.net/npm/view-design@4.3.2/dist/iview.min.js",
    "//cdn.jsdelivr.net/npm/echarts@4.9.0/dist/echarts.min.js"
  ]
};

module.exports = {
  // Project deployment base
  // By default we assume your app will be deployed at the root of a domain,
  // e.g. https://www.my-app.com/
  // If your app is deployed at a sub-path, you will need to specify that
  // sub-path here. For example, if your app is deployed at
  // https://www.foobar.com/my-app/
  // then change this to '/my-app/'
  publicPath: "kettle-admin",
  // tweak internal webpack configuration.
  // see https://github.com/vuejs/vue-cli/blob/dev/docs/webpack.md
  // 如果你不需要使用eslint，把lintOnSave设为false即可
  lintOnSave: true,
  chainWebpack: config => {
    config.resolve.alias
      .set("@", resolve("src")) // key,value自行定义，比如.set('@@', resolve('src/components'))
      .set("_c", resolve("src/components"));
    config.plugin("html").tap(args => {
      args[0].cdn = assetsCDN;
      return args;
    });
  },
  // 设为false打包时不生成.map文件
  productionSourceMap: false,
  configureWebpack: {
    plugins: [
      // (...)
      new webpack.IgnorePlugin(/cptable/)
    ],
    node: {
      fs: "empty"
    },
    externals: assetsCDN.externals
  },
  pluginOptions: {
    "style-resources-loader": {
      preProcessor: "less",
      patterns: ["./src/styles/variable.less"]
    }
  },
  css: {
    extract: process.env.NODE_ENV == "production" ? true : false,
    sourceMap: process.env.NODE_ENV == "development" ? true : false,
    loaderOptions: {
      less: {
        javascriptEnabled: true,
        paths: [
          path.resolve(__dirname, "src"),
          path.resolve(__dirname, "node_modules")
        ]
      }
    }
  },
  runtimeCompiler: true,
  devServer: {
    proxy: {
      "/xtl-server": {
         target: "http://localhost:9876/xtl-server/",
        pathRewrite: { "^/xtl-server": "" },
        changeOrigin: true
     }
   }
  }
};
