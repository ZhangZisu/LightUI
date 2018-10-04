const MonocoEditorPlugin = require("monaco-editor-webpack-plugin");

module.exports = {
  pluginOptions: {
    i18n: {
      locale: "en",
      fallbackLocale: "en",
      localeDir: "locales",
      enableInSFC: false
    }
  },
  configureWebpack: {
    plugins: [new MonocoEditorPlugin()]
  },
  baseUrl: undefined,
  outputDir: undefined,
  assetsDir: "static",
  runtimeCompiler: undefined,
  productionSourceMap: undefined,
  parallel: undefined,
  css: undefined
};
