const path = require('path')
const { config } = require('process')

module.exports = {
  sassOptions: {
    includePaths: [path.resolve(__dirname, './pages')],
  },
}

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer({
  compress: true,
  webpack(config, { webpack }) {
    const prod = process.env.NODE_ENV === 'production'
    const plugins = [...config.plugins]

    return {
      ...config,
      mode: prod ? 'production' : 'development',
      devtool: prod ? 'hidden-source-map' : 'eval',
      plugins,
    }
  },
})
