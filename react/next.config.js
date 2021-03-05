const path = require('path');
const {
  PHASE_DEVELOPMENT_SERVER,
  PHASE_PRODUCTION_BUILD,
} = require('next/constants')


// This uses phases as outlined here: https://nextjs.org/docs/#custom-configuration
module.exports = phase => {
  // when started in development mode `next dev` or `npm run dev` regardless of the value of STAGING environmental variable
  const isDev = phase === PHASE_DEVELOPMENT_SERVER
  // when `next build` or `npm run build` is used
  const isProd = phase === PHASE_PRODUCTION_BUILD && process.env.STAGING !== '1'
  // when `next build` or `npm run build` is used
  const isStaging =
    phase === PHASE_PRODUCTION_BUILD && process.env.STAGING === '1'

  const env = {
    stripeKey: "pk_test_FqYintwbPyNmYIrMX8oQnHmF003NcfrYOS",
    graphqlUrl: (() => {
      if (isDev) return 'http://localhost:3000/graphql'
      if (isProd) {
        return 'http://45.79.111.106:3400/graphql'
      }
      if (isStaging) return 'http://45.79.111.106:3400/graphql'
      return 'graphqlUrl:not (isDev,isProd && !isStaging,isProd && isStaging)'
    })(),
    graphqlWsUrl: (() => {
      if (isDev) return 'ws://localhost:3000/graphql'
      if (isProd) {
        return 'ws://45.79.111.106:3400/graphql'
      }
      if (isStaging) return 'ws://45.79.111.106:3400/graphql';
    })(),
    baseUrl: (() => {
      if (isDev) return 'http://localhost:3000/'
      if (isProd) return 'http://45.79.111.106:3400/'
      if (isStaging) return 'http://45.79.111.106:3400/'
      return 'baseUrl:not (isDev,isProd && !isStaging,isProd && isStaging)'
    })(),
    url: (() => {
      if (isDev) return 'http://localhost:4000/'
      if (isProd) return 'http://localhost:4000/'
      if (isStaging) return 'http://localhost:4000/'
      return 'baseUrl:not (isDev,isProd && !isStaging,isProd && isStaging)'
    })(),
  }
  // next.config.js object
  return {
    env,
    webpack: (config, options) => {
      // modify the `config` here
      config.module.rules.push({
        test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 100000
          }
        }
      });
      if (options.isServer) {
        config.externals = ["react", ...config.externals];
      }
      // config.resolve.alias["react"] = path.resolve(__dirname, ".\\node_modules\\react");
      // config.resolve.alias["next"] = path.resolve(__dirname, ".\\node_modules\\next");

      return config;
    },
  }
}
