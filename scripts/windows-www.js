/* globals exec, rm, cp */
require('shelljs/global')

const path = require('path')
const resolve = _path => path.resolve(__dirname, '..', _path)

const FROM = resolve('dist')
const TO = resolve('windows/FloatBehind/www')

exec('npm run build', { env: process.env })
rm('-rf', TO)
cp('-r', FROM, TO)
