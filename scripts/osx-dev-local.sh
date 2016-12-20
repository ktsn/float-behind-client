#!/bin/bash
set -e

ROOT_DIR=$(cd $(dirname $0); cd ..; pwd)

npm run build
rsync -a --delete $ROOT_DIR/dist/ $ROOT_DIR/osx/www/

xcodebuild build \
  -configuration "Debug Local" \
  -scheme FloatBehindLocal \
  -workspace ${ROOT_DIR}/osx/FloatBehind.xcworkspace \
  CONFIGURATION_BUILD_DIR="${ROOT_DIR}/osx/build/FloatBehindLocal/Debug Local"

open "${ROOT_DIR}/osx/build/FloatBehindLocal/Debug Local/FloatBehind.app"
