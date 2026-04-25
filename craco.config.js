module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      webpackConfig.resolve = webpackConfig.resolve || {};
      webpackConfig.resolve.fallback = {
        ...(webpackConfig.resolve.fallback || {}),
        fs: false,
        util: false,
        crypto: false,
        path: false,
        stream: false,
        http: false,
        https: false,
        zlib: false,
      };
      return webpackConfig;
    },
  },
};