/* eslint-env node */
const config = require('./webpack.config')

config.cache = config.debug = config.watch = true

module.exports = config
